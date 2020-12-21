//
//     name : svg.js
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

import { check_version } from './modules/checking.js';
import { v_axis, genomic_axis, transcript_axis, profile_min_axis, profile_max_axis, profile_axis, get_vbar } from './modules/axis.js';
import { draw_transterms } from './modules/transterms.js';
import { draw_cds } from './modules/cds.js';
import { draw_beaume } from './modules/beaume.js';
import { draw_segments } from './modules/segments.js';
import { draw_promotors, draw_terminators, draw_lines } from './modules/trans_units.js';
import { draw_profiles, draw_blanks, draw_no_data, draw_rho_regions } from './modules/profiles.js';
import { add_feat_name, check_size_svg, check_svg } from './event.js';

check_version();

var width = 1200;
var height = 625;

$('#main').attr("href", path+"/");
$('#suppData').attr("href", path+"/supplementary-data");
$('#help').attr("href", path+"/help");
$('#contact').attr("href", path+"/contact");

// Seqlen
sessionStorage.setItem("seqlen", seqlen);

// Min/Max samples
sessionStorage.setItem("min_CustomCDS", min_CustomCDS);
sessionStorage.setItem("max_CustomCDS", max_CustomCDS);
sessionStorage.setItem("min_Median", min_Median);
sessionStorage.setItem("max_Median", max_Median);

// Selected Experiences
if ( selexp != '' ) {
  for ( let i in sessionStorage ) {
    if ( i.includes("check_") ) {
      sessionStorage.removeItem(i);
    }
  }
  let list = "(";
  for (var exp in selexp) {
    sessionStorage.setItem("check_"+selexp[exp], 1);
    if ( selcol[exp] != 0 ) { sessionStorage.setItem(selexp[exp], "#"+selcol[exp]); }
    list += "'" + selexp[exp] + "',";
  }
  list += ")"; list = list.replace(",)", ")");
  sessionStorage.setItem("listExpChecked", list);
}

// Size
let s_size = 0;
if ( size !== null ) {
  s_size = parseInt(size);
  sessionStorage.setItem("size", s_size);
}
else {
  if ( sessionStorage.getItem("size") === null  ) {
    sessionStorage.setItem("size", 10000);
    s_size = 10000;
  }
  else {
    s_size = parseInt(sessionStorage.getItem("size"));
  }
}

// Normalization
if ( norm !== null ) {
  sessionStorage.setItem("norm", norm);
}
else {
  if ( sessionStorage.getItem("norm") === null  ) {
    sessionStorage.setItem("norm", "CustomCDS");
  }
}
// Rho
if ( rho !== null ) {
  sessionStorage.setItem("rho", rho);
}
else {
  if ( sessionStorage.getItem("rho") === null  ) {
    sessionStorage.setItem("rho", false);
  }
}

// Features names
if ( feat !== null ) {
  sessionStorage.setItem("feat", feat);
}
else {
  if ( sessionStorage.getItem("feat") === null  ) {
    sessionStorage.setItem("feat", false);
  }
}

// Create SVG element for Genomic View
var svg = d3.select("#svg_genomic_view")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "svg");

check_size_svg(sessionStorage.getItem("norm"), sessionStorage.getItem("rho"), name);

let d_start;
// Start view (without Gene)
if ( typeof gene === 'undefined' || gene === null ) {
  d_start = parseInt(start);
  sessionStorage.setItem("start", d_start);
}
// Start view (Gene ID)
else {
  sessionStorage.setItem("gene", gene.name);
  d_start = get_start(gene);
  sessionStorage.setItem("start", d_start);
  get_clusters(gene);
  get_genbank(gene.locustag);
  get_infos(gene.locustag);
  get_conditions(gene.locustag, 1);
  get_conditions(gene.locustag, -1);
  get_corr_segments(gene.locustag, 1);
  get_corr_segments(gene.locustag, -1);
  let file = gene.name+"_"+gene.start+"_"+gene.stop+"_"+gene.strand+".png";
  $("#profile").attr("src", path + "/img/profiles/"+file);
}

// Start view (Gene ID)
export function get_start(gene) {

    let g_size = gene.stop - gene.start + 1;
    let diff = (s_size - g_size) / 2;
    let init = gene.start - diff;

    if ( init <= 0 ) { init = 1; }

    return init;
}

// GenBank
function get_genbank(locus) {

  $.getJSON($SCRIPT_ROOT + '/_get_genbank',
  {
    locus: locus
  },
  function success(list_gb) {
    let div = "";

    if ( Object.keys(list_gb).length === 0 ) {
      div += "<i>No information</i>";
    }
    else {
      div += "<ul>";
      $.each(list_gb, function(i, gb){
          div += "<li><b>"+i+":</b> "+gb+"</li>";
        });
      div += "</ul>";
    }

    $("#gb").html(div);
  });
}
// Additional informations
function get_infos(locus) {

  $.getJSON($SCRIPT_ROOT + '/_get_infos',
  {
    locus: locus
  },
  function success(list_info) {

    let div = "";
    if ( path.includes("seb") ) {
      div += "<a href = 'http://subtiwiki.uni-goettingen.de/v3/gene/search/exact/"+locus+"' target='_blank'> \
              <img src='"+path+"/img/subtiwiki.png' width='12%'></a>";
    }
    else {
      div += "<a href = 'https://aureowiki.med.uni-greifswald.de/"+locus+"' target='_blank'> \
              <img src='"+path+"/img/aureowiki.png' width='12%'></a>";
    }
    div += "<br/><br/>";
    $.each(list_info, function(i, info){
        div += "<div><b>"+i+": </b>"+info+"</div>";
      });
    $("#add").html(div);
  });
}
// Clusters
function get_clusters(gene) {

  let div = "<div style=\"float:left;\"><b>Expression clusters&nbsp;</div> \
             <div style=\"float:left;\" title=\"Cluster levels A, B, and C correspond to decreasing correlation between expression profiles (Pearson pairwise correlation r=0.8, 0.6, and 0.4, respectively). They were obtained by cutting a hierarchical clustering built with average-link on pairwise Pearson distances (1-r) at the corresponding heights.\"> \
             <svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-info-circle-fill' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
             <path fill-rule='evenodd' d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/> \
             </svg></div><div style=\"float:left;\">&nbsp;:&nbsp;</b></div> \
		         <a class='link' href = '"+path+"/?cluster=" + gene.clustera + "'>" + gene.clustera + "</a> \
					   <a class='link' href = '"+path+"/?cluster=" + gene.clusterb + "'>" + gene.clusterb + "</a> \
					   <a class='link' href = '"+path+"/?cluster=" + gene.clusterc + "'>" + gene.clusterc + "</a>";
  $("#clusters").html(div);
}
// Expression Conditions
function get_conditions(locus, level) {

    $.getJSON($SCRIPT_ROOT + '/_get_conditions',
    {
      locus: locus,
      level: level
    },
    function success(list_all) {

      let title = ""; let tag = "";
      if ( level == 1 ) { title = "Highest Expression Conditions"; tag = "#high_conditions"; }
      else              { title = "Lowest Expression Conditions"; tag = "#low_conditions"; }

      let div = "<div><b>"+title+"</b></div><br/>";
          div += "<table width='90%' class='table table-striped table-bordered text-center table-sm'><tr class='bg-info text-white'>";

      for ( let i = 0 ; i < list_all["name"].length ; i++ ) {
          div += "<th>" + list_all["name"][i] + "</th>";
      }

      div += "</tr><tr class='bg-white text-info'>";

      for ( let i = 0 ; i < list_all["value"].length ; i++ ) {
          div += "<td>" + list_all["value"][i] + "</td>";
      }

      div += "</tr></table>";
      $(tag).html(div);
    });
}
// Correlated Segments
function get_corr_segments(locus, level) {

  $.getJSON($SCRIPT_ROOT + '/_get_corr_segments',
  {
    locus: locus,
    level: level
  },
  function success(list_all) {

    let title = ""; let tag = "";
    if ( level == 1 ) { title = "Most Positively Correlated Segments"; tag = "#pos_segments"; }
    else              { title = "Most Negatively Correlated Segments"; tag = "#neg_segments"; }

    let div = "<div><div style=\"float:left;\"><b>"+title+"</b>&nbsp;</div> \
               <div style=\"float:left;\" title=\"Pairwise Pearson correlation coefficients computed between condition-dependent profiles.\"> \
               <svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-info-circle-fill' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
               <path fill-rule='evenodd' d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/> \
               </svg></div> \
               </div><br/><br/>";
        div += "<table width='90%' class='table table-striped table-bordered text-center table-sm'><tr class='bg-info text-white'>";

    for ( let i = 0 ; i < list_all["name"].length ; i++ ) {
        div += "<th><a class = 'text-white' href='"+path+"/viewer/?id=" + list_all["name"][i] + "'>" + list_all["name"][i] + "</a></th>";
    }

    div += "</tr><tr class='bg-white text-info'>";

    for ( let i = 0 ; i < list_all["value"].length ; i++ ) {
        div += "<td>" + list_all["value"][i] + "</td>";
    }

    div += "</tr></table>";
    $(tag).html(div);
  });
}

// Genomic axis
get_axis(d_start, s_size, width);
function get_axis(d_start, s_size, width) {
  d3.select("#genomic_axis").remove();
  var g_axis = svg.append("g").attr("id", "genomic_axis");
  genomic_axis(d_start, s_size, width, g_axis);
}

// transtermHP
get_transterms(d_start, (d_start+s_size-1), s_size);
function get_transterms(start, stop, s_size) {

    d3.select("#transterms").remove();

    $.getJSON($SCRIPT_ROOT + '/_get_transterms',
    {
      start: Math.ceil(start,10),
      stop: Math.ceil(stop,10)
    },
    function success(list_transterms) {

      if ( jQuery.isEmptyObject(list_transterms) == false ) {
        var g_transterms = svg.append("g").attr("id", "transterms");

        $.each(list_transterms, function(i, transterm){
            draw_transterms(transterm, start, stop, (width-60), 60, s_size, g_transterms);
          });
      }
    });
}

// CDS
get_cds(d_start, (d_start+s_size-1), s_size);
function get_cds(start, stop, s_size) {

  let position = parseInt(list_features['CDS']) * 100;

  d3.select("#cds").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_cds',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_cds) {

    if ( jQuery.isEmptyObject(list_cds) == false ) {
      var g_cds = svg.append("g").attr("id", "cds");

      $.each(list_cds, function(i, cds){
          draw_cds(cds, start, stop, (width-60), position, s_size, g_cds);
        });

      if ( sessionStorage.getItem("gene") != null ) {
        d3.selectAll("#"+gene.locustag).style("fill", "#8462B1");
      }
    }
  });
}

// Beaume
get_beaume(d_start, (d_start+s_size-1), s_size);
function get_beaume(start, stop, s_size) {

  let position = parseInt(list_features['Regulator']) * 100;

  d3.select("#beaume").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_beaume',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_beaume) {

    if ( jQuery.isEmptyObject(list_beaume) == false ) {
      var g_beaume = svg.append("g").attr("id", "beaume");

      $.each(list_beaume, function(i, beaume){
          draw_beaume(beaume, start, stop, (width-60), position, s_size, g_beaume);
        });
    }
  });
}

// Segments
get_segments(d_start, (d_start+s_size-1), s_size);
function get_segments(start, stop, s_size) {

  let position = parseInt(list_features['segment']) * 100;

  d3.select("#segments").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_segments',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_segments) {

    if ( jQuery.isEmptyObject(list_segments) == false ) {
      var g_segments = svg.append("g").attr("id", "segments");

      $.each(list_segments, function(i, segment){
          draw_segments(segment, start, stop, (width-60), position, s_size, g_segments);
        });
    }
  });
}

// Transcript units
function get_transcript_axis(pos, width) {
  d3.select("#transcript_axis").remove();
  var t_axis = svg.append("g").attr("id", "transcript_axis");
  transcript_axis(pos, width, t_axis);
}
get_promotors(d_start, (d_start+s_size-1), s_size);
function get_promotors(start, stop, s_size) {

  let position = parseInt(list_features['promoter']) * 100;

  d3.select("#promotors").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_promotors',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_promotors) {

    if ( jQuery.isEmptyObject(list_promotors) == false ) {
      get_transcript_axis(position, width);
      var g_promotors = svg.append("g").attr("id", "promotors");

      $.each(list_promotors, function(i, promotor){
          draw_promotors(promotor, start, stop, (width-60), position, s_size, g_promotors);
        });
    }
  });
}
get_terminators(d_start, (d_start+s_size-1), s_size);
function get_terminators(start, stop, s_size) {

  let position = parseInt(list_features['terminator']) * 100;

  d3.select("#terminators").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_terminators',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_terminators) {

    if ( jQuery.isEmptyObject(list_terminators) == false ) {
      var g_terminators = svg.append("g").attr("id", "terminators");

      $.each(list_terminators, function(i, terminator){
          draw_terminators(terminator, start, stop, (width-60), position, s_size, g_terminators);
        });
    }
  });
}
get_transcript_lines(d_start, (d_start+s_size-1), s_size);
function get_transcript_lines(start, stop, s_size) {

  let position = parseInt(list_features['terminator']) * 100;

  d3.select("#transcript_lines").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_lines',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_lines) {

    if ( jQuery.isEmptyObject(list_lines) == false ) {
      var g_lines = svg.append("g").attr("id", "transcript_lines");

      $.each(list_lines, function(i, lines){
          draw_lines(lines, start, stop, (width-60), position, s_size, g_lines);
        });
    }
  });
}

// Profiles
get_profile_axis(1200, sessionStorage.getItem("norm"));
export function get_profile_axis(l_width, normalisation) {

  let position = parseInt(list_features['profiles']) * 100 + 100;

  d3.selectAll("#profiles_axis").remove();
  d3.selectAll("#profiles_axis_min_max").remove();
  var p_axis = svg.append("g").attr("id", "profiles_axis");
  profile_axis(l_width, normalisation, p_axis, (position-60));
}
if ( sessionStorage.getItem("listExpChecked") != undefined ) {
  get_selectedexp(d_start, (d_start+s_size-1), sessionStorage.getItem("norm"), s_size, sessionStorage.getItem("listExpChecked"));
}
else {
  get_defaultexp(d_start, (d_start+s_size-1), sessionStorage.getItem("norm"), s_size);
}
export function get_defaultexp(start, stop, normalisation, l_size) {
  d3.selectAll("#profiles").remove();
  d3.selectAll("#v_scale_exp").remove();

  let position = parseInt(list_features['profiles']) * 100 + 100;

  $.getJSON($SCRIPT_ROOT + '/_get_defaultexp',
  {
    norm: normalisation
  },
  function success(list_exp) {

    var g_exp = svg.append("g").attr("id", "profiles");

    $.each(list_exp, function(i, exp){
      draw_profiles(exp, start, stop, (width-60), position, l_size, g_exp, seqlen);
    });

    // Features names
    if ( sessionStorage.getItem("feat") == 'true' ) {
      add_feat_name();
    }

    d3.select("#profile_blanks").remove();
    get_blank_region(start, stop, l_size, "profile_blanks", position); //(position-110)
  });
}
export function get_selectedexp(start, stop, normalisation, l_size, list_name) {

  d3.select("#profiles").remove();
  d3.select("#v_scale_exp").remove();

  let position = parseInt(list_features['profiles']) * 100 + 100;

  $.getJSON($SCRIPT_ROOT + '/_get_selected_exp',
  {
    list: list_name,
    norm: normalisation
  },
  function success(list_exp) {

    var g_exp = svg.append("g").attr("id", "profiles");

    $.each(list_exp, function(i, exp){
      draw_profiles(exp, start, stop, (width-60), position, l_size, g_exp, seqlen);
    });

    // Features names
    if ( sessionStorage.getItem("feat") == 'true' ) {
      add_feat_name();
    }

    d3.select("#profile_blanks").remove();
    get_blank_region(start, stop, l_size, "profile_blanks", position);
  });
}

// Rho
if ( sessionStorage.getItem("rho") == 'true' ) {

  check_size_svg(sessionStorage.getItem("norm"), sessionStorage.getItem("rho"), name);
  get_rho_group_exp(d_start, (d_start+s_size-1), sessionStorage.getItem("norm"), s_size);
}
export function get_rho_axis(l_width, normalisation, pos) {
  d3.select("#rho_axis_"+pos).remove();
  d3.select("#rho_axis_min_max").remove();
  var r_axis = svg.append("g").attr("id", "rho_axis_"+pos);
  profile_axis(1200, normalisation, r_axis, pos);
}
export function get_rho_exp(start, stop, normalisation, l_size) {
  d3.select("#rho").remove();
  d3.select("#v_scale_rho").remove();

  $.getJSON($SCRIPT_ROOT + '/_get_rhoexp',
  {
    norm: normalisation
  },
  function success(list_rho_exp) {

    var g_rho = svg.append("g").attr("id", "rho");

    $.each(list_rho_exp, function(i, rho_exp){
      draw_profiles(rho_exp, start, stop, (width-60), 640, l_size, g_rho, seqlen);
    });

    d3.select("#rho_blanks").remove();
    get_blank_region(start, stop, l_size, "rho_blanks", 520); // 610
  });
}
export function get_rho_group_exp(start, stop, normalisation, l_size) {

  d3.selectAll("g[id*='rho']").remove();
  d3.selectAll("g[id*='rhoregions']").remove();

  let position = parseInt(list_features['profiles']) * 100 + 100;

  $.getJSON($SCRIPT_ROOT + '/_get_rhogroups',
    {
      norm: normalisation
    },
    function success(list_rho_groups) {

      if ( sessionStorage.getItem("norm") == "CustomCDS" ) {
        var pos_axe = position + 180;
        if ( name.includes("aureus") ) { pos_axe = position + 220; }
      }
      else {
        var pos_axe = position + 240;
        // var pos_axe = 740;
        if ( name.includes("aureus") ) { pos_axe = position + 280; }
      }

      d3.select("#rho_"+pos_axe).remove();
      var g_rho = svg.append("g").attr("id", "rho_"+pos_axe);

      $.each(list_rho_groups, function(i, rho_group){

        get_rho_axis(1200, sessionStorage.getItem("norm"), pos_axe);

        if ( name.includes("aureus") ) {
          if ( sessionStorage.getItem("norm") == "CustomCDS" ) {
            get_rho_regions(start, stop, l_size, (pos_axe+60), i, sessionStorage.getItem("norm"))
          }
          else {
            get_rho_regions(start, stop, l_size, (pos_axe+90), i, sessionStorage.getItem("norm"))
          }
        }

        $.each(rho_group, function(i, rho_exp){
          draw_profiles(rho_exp, start, stop, (width-60), (pos_axe+60), l_size, g_rho, seqlen);
        });

        d3.select("#rho_blanks_"+pos_axe).remove();
        get_blank_region(start, stop, l_size, "rho_blanks_"+pos_axe, (pos_axe+30));

        pos_axe += 200;
        if ( name.includes("aureus") ) {
          if ( sessionStorage.getItem("norm") == "CustomCDS" ) { pos_axe += 80; }
          else { pos_axe += 140; }
          pos_axe += 40;
        }
      });
    });
}

// Rho regions
function get_rho_regions(start, stop, s_size, pos, group, norm) {

  var g_rho_regions = svg.append("g").attr("id", "rhoregions"+pos);

  $.getJSON($SCRIPT_ROOT + '/_get_rhoregions',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10),
    group: group
  },
  function success(list_rhoregions) {

    $.each(list_rhoregions, function(i, segment) {
        draw_rho_regions(segment, start, stop, (width-60), (pos+170), s_size, g_rho_regions, norm);
      });
  });
}

// Blank regions
function get_blank_region(start, stop, s_size, name, pos) {

  $.getJSON($SCRIPT_ROOT + '/_get_blank',
  {
    start: Math.ceil(start,10),
    stop: Math.ceil(stop,10)
  },
  function success(list_blank) {

    var g_blank = svg.append("g").attr("id", name);

    if ( name == "profile_blanks" ) {
      $.each(list_blank, function(i, blank){
        draw_blanks(blank, start, stop, (width-60), (pos-110), s_size, g_blank, "profile");
      });
    }
    else {
      $.each(list_blank, function(i, blank){
        draw_blanks(blank, start, stop, (width-60), (pos-90), s_size, g_blank, "rho");
      });
    }

    if ( name == "profile_blanks" ) {
      var p_m_axis = svg.append("g").attr("id", "profiles_axis_min_max");
      draw_no_data((pos-110), g_blank, "profile");
      profile_min_axis(1200, sessionStorage.getItem("norm"), p_m_axis, (pos-60), "profiles_");
      profile_max_axis(1200, sessionStorage.getItem("norm"), p_m_axis, (pos-60), "profiles_");
      var g_vScale = svg.append("g").attr("id", "v_scale_exp");
      v_axis(sessionStorage.getItem("min_"+sessionStorage.getItem("norm")), sessionStorage.getItem("max_"+sessionStorage.getItem("norm")), g_vScale, (pos-60));
    }
    else {
      var r_m_axis = svg.append("g").attr("id", "rho_axis_min_max");
      draw_no_data((pos-90), g_blank, "rho");
      profile_min_axis(1200, sessionStorage.getItem("norm"), r_m_axis, (pos-30), "rho_");
      profile_max_axis(1200, sessionStorage.getItem("norm"), r_m_axis, (pos-30), "rho_");
      d3.select("#v_scale_rho_"+(pos-30)).remove();
      var g_vScale = svg.append("g").attr("id", "v_scale_rho_"+(pos-30));
      v_axis(sessionStorage.getItem("min_"+sessionStorage.getItem("norm")), sessionStorage.getItem("max_"+sessionStorage.getItem("norm")), g_vScale, (pos-30));
    }

    if ( sessionStorage.getItem("vBar") !== null ) {
      get_vbar(sessionStorage.getItem("vBar"), svg, s_size, start);
    }

    $('#geno_spinner').hide();
  });
}

// Vertical bar
svg.on("click", function () {

    var coordinates= d3.mouse(this);
    var x = coordinates[0];
    var y = coordinates[1];

    if ( x >= 30 && x <= 1170 ) {

      let r_val = Math.trunc( ((x - 30) * s_size) / 1140 + d_start );
      get_vbar(r_val, svg, s_size, d_start);
    }

    else {

      d3.select("#repere").remove();
      sessionStorage.setItem("vBar", null);
    }
});
