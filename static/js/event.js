//
//     name : event.js
//
//     Copyright (C) 2020  Sandra Dérozier (INRAE)
//
//     This program is free software; you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation; either version 2 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program; see the file COPYING . If not, write to the
//     Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//
//     Please send bugreports with examples or suggestions to
//     sandra.derozier@inrae.fr

import { get_start, get_profile_axis, get_defaultexp, get_selectedexp, get_rho_exp, get_rho_axis, get_rho_group_exp } from './svg.js';

let seqlen = sessionStorage.getItem("seqlen");
size = parseInt(sessionStorage.getItem("size"));

// Share button
$("#share").click(function() {

  let url = location.protocol + '//' + location.host + location.pathname;
  if ( sessionStorage.getItem("gene") != undefined ) {
    url += "?id="+sessionStorage.getItem("gene");
  }
  else {
    url += "?start="+sessionStorage.getItem("start");
  }
  url += "&size="+sessionStorage.getItem("size");
  url += "&norm="+sessionStorage.getItem("norm");
  url += "&rho="+sessionStorage.getItem("rho");
  url += "&fname="+sessionStorage.getItem("feat");

  for ( let i in sessionStorage ) {
    if ( i.includes("check_") && sessionStorage.getItem(i) == 1 ) {
      url += "&exp="+i.replace("check_", "");
      if ( sessionStorage.getItem(i.replace("check_", "")) ) { url += "&color="+sessionStorage.getItem(i.replace("check_", "")).replace('#', ''); }
      else { url += "&color=0"; }
    }
  }

  d3.select("#inpshare").property('value', url);
});

var clipboard = new Clipboard('.copyButton');

// Export SVG
$("#save_svg").click(function(){
  svgAsDataUri(d3.select('#svg').node(), {"excludeCss" : true}, function(uri) {
      download("Genoscapist.svg", uri);
  });
});
// Export PNG
$("#save_png").click(function(){
  saveSvgAsPng(d3.select('#svg').node(), "Genoscapist.png", {backgroundColor: 'white'});
});

// Legend
$( "#openTab").click(function() {
    window.open(path+'/files/Legend.svg')
});
// Normalisation
if ( sessionStorage.getItem("norm") == "CustomCDS" ) {
  $("#normalisation").html("Switch to Median normalisation");
}
else {
  $("#normalisation").html("Switch to CDS-Quantile normalisation");
}
$("#normalisation").click(function() {

  $('#geno_spinner').show();

  let from = def_start();

  if ( sessionStorage.getItem("norm") == "CustomCDS" ) {
    norm = "Median";
    $("#normalisation").html("Switch to CDS-Quantile normalisation");
    check_size_svg(norm, sessionStorage.getItem("rho"), name);
  }
  else {
    norm = "CustomCDS";
    $("#normalisation").html("Switch to Median normalisation");
    check_size_svg(norm, sessionStorage.getItem("rho"), name);
  }
  sessionStorage.setItem("norm", norm);

  get_profile_axis(size, sessionStorage.getItem("norm"));

  if ( sessionStorage.getItem("listExpChecked") != undefined ) {
    get_selectedexp(from, (from+size-1), sessionStorage.getItem("norm"), size, sessionStorage.getItem("listExpChecked"));
  }
  else {
    get_defaultexp(from, (from+size-1), sessionStorage.getItem("norm"), size);
  }

  if ( sessionStorage.getItem("rho") == 'true' ) {

    get_rho_group_exp(from, (from+size-1), sessionStorage.getItem("norm"), size);
  }
});

// Rho
if ( sessionStorage.getItem("rho") == 'false' ) {
  $("#add_rho").html("Add Rho samples track");
}
else {
  $("#add_rho").html("Remove Rho samples track");
}
// Rho apply button
$("#rho_apply").click(function() {
  $('#geno_spinner').show();
  if ($('input[name=checkrhosample]').is(':checked') && sessionStorage.getItem("rho") == 'false'){
    check_size_svg(sessionStorage.getItem("norm"), 'true', name);
    rho = true;
    $("#add_rho").html("Remove Rho samples track");
    let from = def_start();
    get_rho_group_exp(from, (from+size-1), sessionStorage.getItem("norm"), size);
  }
  if ($('input[name=checkrhosample]').is(':checked') == false && sessionStorage.getItem("rho") == 'true') {
    check_size_svg(sessionStorage.getItem("norm"), 'false', name);
    rho = false;
    $("#add_rho").html("Add Rho samples track");
    d3.selectAll("g[id*='rho']").remove();
    $('#geno_spinner').hide();
  }
  sessionStorage.setItem("rho", rho);
});

// Features name
if ( sessionStorage.getItem("feat") == 'true' ) {
  $("#add_feat").html("Remove feature names");
}
else {
  $("#add_feat").html("Add feature names");
}
$("#add_feat").click(function(){
  if ( sessionStorage.getItem("feat") == 'false' ) {
    feat = true;
    add_feat_name()
  }
  else {
    feat = false;
    remove_feat();
  }
  sessionStorage.setItem("feat", feat);
});
export function add_feat_name() {
  $("#add_feat").html("Remove feature names");
  d3.selectAll("text.name").attr("visibility", "visible");
}
function remove_feat() {
  $("#add_feat").html("Add feature names");
  d3.selectAll("text.name").attr("visibility", "hidden");
}

// Navigation buttons
$("#big_left").on("click", function(){
    let l_start = parseInt(sessionStorage.getItem("start")) - size;
    l_start = check_start(l_start);
    sessionStorage.removeItem("gene");
    location.assign(path+"/viewer/?start="+l_start+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
});
$("#small_left").on("click", function(){
    let l_start = parseInt(sessionStorage.getItem("start")) - size/2;
    l_start = check_start(l_start);
    sessionStorage.removeItem("gene");
    location.assign(path+"/viewer/?start="+l_start+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
});
$("#big_right").on("click", function(){
    let l_start = parseInt(sessionStorage.getItem("start")) + size;
    l_start = check_start(l_start);
    sessionStorage.removeItem("gene");
    location.assign(path+"/viewer/?start="+l_start+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
});
$("#small_right").on("click", function(){
    let l_start = parseInt(sessionStorage.getItem("start")) + size/2;
    l_start = check_start(l_start);
    sessionStorage.removeItem("gene");
    location.assign(path+"/viewer/?start="+l_start+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
});

// Zoom buttons
$("#zoom_in").on("click", function(){
    let from = parseInt(sessionStorage.getItem("start"));
    size = size * 0.5;
    size = check_size(size);
    if ( sessionStorage.getItem("gene") != null ) {
      location.assign(path+"/viewer/?id="+sessionStorage.getItem("gene")+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
    else {
      location.assign(path+"/viewer/?start="+from+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
});
$("#zoom_small_in").on("click", function() {
    let from = parseInt(sessionStorage.getItem("start"));
    size = size * 0.75;
    size = check_size(size);
    if ( sessionStorage.getItem("gene") != null ) {
      location.assign(path+"/viewer/?id="+sessionStorage.getItem("gene")+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
    else {
      location.assign(path+"/viewer/?start="+from+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
});
$("#zoom_neutral").on("click", function() {
    let from = parseInt(sessionStorage.getItem("start"));
    size = 10000;
    if ( sessionStorage.getItem("gene") != null ) {
      location.assign(path+"/viewer/?id="+sessionStorage.getItem("gene")+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
    else {
      location.assign(path+"/viewer/?start="+from+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
});
$("#zoom_small_out").on("click", function() {
    let from = parseInt(sessionStorage.getItem("start"));
    size = size * 1.5;
    size = check_size(size);
    if ( sessionStorage.getItem("gene") != null ) {
      location.assign(path+"/viewer/?id="+sessionStorage.getItem("gene")+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
    else {
      location.assign(path+"/viewer/?start="+from+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
});
$("#zoom_out").on("click", function() {
    let from = parseInt(sessionStorage.getItem("start"));
    size = size * 2;
    size = check_size(size);
    if ( sessionStorage.getItem("gene") != null ) {
      location.assign(path+"/viewer/?id="+sessionStorage.getItem("gene")+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
    else {
      location.assign(path+"/viewer/?start="+from+"&size="+size+"&norm="+sessionStorage.getItem("norm")+"&rho="+sessionStorage.getItem("rho")+"&fname="+sessionStorage.getItem("feat"));
    }
});

// Click out of modal --> close it
$(document).click(function (e) {
    if ($(e.target).is('#sampleSelection')) {
        document.getElementById('sampleSelection').close();
    }
    if ($(e.target).is('#aboutProfile')) {
        document.getElementById('aboutProfile').close();
    }
});

// @todo
export function check_svg(norm, rho, specie) {

  if ( rho == 'true' ) {
    if ( d3.selectAll('#rho_axeMinM') ) {
      alert(d3.selectAll('#rho_axeMinM').node().getBBox()['y']);
    }
  }
  else {
    if ( d3.selectAll('#profiles_axeMinM') ) {
      alert(d3.selectAll('#profiles_axeMinM').node().getBBox()['y']);
    }
  }
}

export function check_size_svg(norm, rho, specie) {

  if ( rho == 'true' ) {

    if ( norm == "CustomCDS" ) {
      if ( name.includes("subtilis") )  { $("#svg").attr("height", "860"); }
      else                              { $("#svg").attr("height", "2040"); }
    }
    else {
      if ( name.includes("subtilis") )  { $("#svg").attr("height", "975"); }
      else                              { $("#svg").attr("height", "2340"); }
    }
  }
  else {
    if ( norm == "CustomCDS" ) {
      if ( name.includes("subtilis") )  { $("#svg").attr("height", "625"); }
      else                              { $("#svg").attr("height", "760"); }
    }
    else {
      if ( name.includes("subtilis") )  { $("#svg").attr("height", "680"); }
      else                              { $("#svg").attr("height", "820"); }
    }
  }

  if ( sessionStorage.getItem("min_Median") == 0 ) {
    $("#svg").attr("height", "950"); // 940
  }
}

function def_start() {
  let tmp_start;
    tmp_start = parseInt(sessionStorage.getItem("start"));
  return tmp_start;
}

function check_size(l_size) {
  if ( l_size < 10 )                                      { l_size = 10; }
  else if ( l_size > sessionStorage.getItem("seqlen") )   { l_size = sessionStorage.getItem("seqlen"); }
  return l_size;
}

function check_start(start) {
  if ( start <= 0 )                                     { start = 1; }
  else if ( start >= sessionStorage.getItem("seqlen") ) { start = sessionStorage.getItem("seqlen") - size + 1; }
  return start;
}
