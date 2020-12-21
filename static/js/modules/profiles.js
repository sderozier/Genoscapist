//
//     name : profiles.js
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

import { jq } from './samples.js';

export function draw_profiles(exp, seq_start, seq_stop, w_size, startY, seq_size, g_exp, seqlen) {

    let coord = "";
    let color = exp.color;
    if ( sessionStorage.getItem(exp.name) != undefined && sessionStorage.getItem(exp.name) != exp.color ) {
      color = sessionStorage.getItem(exp.name);
      exp.new_color = sessionStorage.getItem(exp.name);
    }
    let g_expr = g_exp.append("g")
                      .attr("id", exp.name+"_"+exp.strand)
                      .style("fill", "none")
                      .style("stroke", color)
                      .on("mouseover", function() { over(exp, g_expr); })
                      .on("mouseout", function() { out(exp); });

    if ( exp.project == 'Reannotation' ) {

      g_expr.on("click", function() { click(exp); });
      g_expr.attr("data-toggle", "modal");
      g_expr.attr("data-target", "#sampleModal");
    }

    $.getJSON($SCRIPT_ROOT + '/_get_expression',
    {
      start: Math.ceil(seq_start,10),
      stop: Math.ceil(seq_stop,10),
      id: exp.id,
      seq_size: seqlen
    },
    function success(list_expr) {

      $.each(list_expr, function(i, expr){

          let x; let y; let factor = 10;

          x = ((expr.position - seq_start) * w_size) / seq_size;

          let varNorm = -80;
          let space = 170;
          if ( exp.norm == "CustomCDS" ) {
            varNorm = 0;
            if ( name.includes("subtilis") ) { space = 120; }
            else                             { space = 140; }
          }
          else {
            if ( name.includes("subtilis") ) { space = 150; }
          }

          if ( exp.strand == -1 ) {
            y = 60 + startY + space - expr.signal * factor + varNorm;
          }
          else {
            y = 60 + startY - expr.signal * factor + varNorm;
          }

          coord += (x+30)+","+y+" ";
        });

        // SVG writing
        var f_expr = g_expr.append("polyline")
                           .attr("points", coord);
    });
}

export function draw_blanks(blank, seq_start, seq_stop, w_size, startY, seq_size, g_blank, type) {

    let startX = 0; let stopX = 0;
    let g_bl = g_blank.append("g").attr("id", blank.name);

    // Start in
    if ( blank.start < seq_stop && blank.start > seq_start ) {
      startX = ( ( blank.start - seq_start ) * w_size ) / seq_size;
    }

    // Stop in
    if ( blank.stop < seq_stop && blank.stop > seq_start ) {
      stopX = ( ( blank.stop - seq_start ) * w_size ) / seq_size;
    }
    else {
      stopX = 1140;
    }

    var f_blank = g_bl.append("rect")
                      .attr("x", startX+30)
                      .attr("width", stopX-startX+1)
                      .attr("height", 120)
                      .style("fill", "white")
                      .style("stroke", "white")
                      .style("fill-opacity", "1");

    if ( name.includes("aureus") && type == "rho" ) { startY += 10; }

    if ( sessionStorage.getItem("norm") == "Median" ) {
      f_blank.attr("height", "140");
      if ( name.includes("aureus") ) {
        f_blank.attr("height", "150");
      }
      if ( blank.complement == "1" ) {
        if ( name.includes("subtilis") ) {
          if ( type != "rho" ) { f_blank.attr("y", (startY-10)); }
          else { f_blank.attr("y", startY); }
        }
        else { f_blank.attr("y", startY); }
      }
      else {
        if ( name.includes("subtilis") ) {
          if ( type != 'rho' ) { f_blank.attr("y", (startY + 140)); }
          else { f_blank.attr("y", (startY + 150)); }
        }
        else { f_blank.attr("y", (startY + 170)); }
      }
    }
    else {
      if ( blank.complement == "1" ) {
        if ( name.includes("subtilis") ) { f_blank.attr("y", startY); }
        else { f_blank.attr("y", (startY+5)); }
      }
      else {
        if ( name.includes("subtilis") ) { f_blank.attr("y", (startY + 120)); }
        else { f_blank.attr("y", (startY + 145)); }
      }
    }
}

export function draw_no_data(startY, g_blank, type) {

    let height = 240;
    // TEST
    if ( name.includes("aureus") ) { height = 270; if ( type == "rho" ) { startY += 10; } }

    let g_bl1 = g_blank.append("g").attr("id", "blank_start");
    var f_bl1 = g_bl1.append("rect")
                    .attr("x", 0)
                    .attr("y", startY)
                    .attr("width", 30)
                    .attr("height", height)
                    .style("fill", "white")
                    .style("stroke", "white")
                    .style("fill-opacity", "1");

    let g_bl2 = g_blank.append("g").attr("id", "blank_stop");
    var f_bl2 = g_bl2.append("rect")
                     .attr("x", 1170)
                     .attr("y", startY)
                     .attr("width", 30)
                     .attr("height", height)
                     .style("fill", "white")
                     .style("stroke", "white")
                     .style("fill-opacity", "1");

    if ( sessionStorage.getItem("norm") == "Median" ) {

      if ( name.includes("subtilis") ) {
        f_bl1.attr("height", "300")
             .attr("y", (startY-10));
        f_bl2.attr("height", "300")
             .attr("y", (startY-10));
      }
      else {
        f_bl1.attr("height", "320");
        f_bl2.attr("height", "320");
      }
    }
}

export function draw_rho_regions(segment, seq_start, seq_stop, w_size, startY, seq_size, g_segment, norm) {

  let y = 0;

  if ( segment.complement == '-1' )  { y = 20; }
  if ( norm == 'Median') {
    if ( segment.complement == '-1' ) { y+= 30; }
    else                              { y+= 25; }
  }

  let startX = 0; let stopX = 0;

  let g_seg = g_segment.append("g").attr("id", "beaume"+segment.name);

  // Start in
  if ( segment.start <= seq_stop && segment.start >= seq_start ) {
    startX = ( (segment.start - seq_start) * w_size) / seq_size;
  }
  // Start out
  else {
    startX = 0;

    var points = g_seg.append("text");
    points.attr("x", startX+15)
          .attr("y", startY+5+y)
          .text("...")
          .style("stroke", segment.color)
          .style("fill", segment.color);
  }

  // Stop in
  if ( segment.stop <= seq_stop && segment.stop >= seq_start ) {
    stopX = ( ( segment.stop - seq_start ) * w_size) / seq_size;
  }
  // Stop out
  else {
    stopX = 1140;

    var points = g_seg.append("text");
    points.attr("x", stopX+35)
          .attr("y", startY+5+y)
          .text("...")
          .style("stroke", segment.color)
          .style("fill", segment.color);
  }

  // SVG writing
  var f_seg = g_seg.append("rect")
                   .attr("x", startX+30)
                   .attr("y", startY+y)
                   .attr("width", stopX-startX+1)
                   .attr("height", 10)
                   .style("fill", segment.color)
                   .style("stroke", segment.color);
}

// Mouse over event
function over(exp, g_expr) {

  let width; let height;
  width = d3.mouse(d3.event.target)[0] = bound(d3.mouse(d3.event.target)[0], 0, width);
  height = d3.mouse(d3.event.target)[1] = bound(d3.mouse(d3.event.target)[1], 0, height);

  var n_exp = g_expr.append("g").attr("id", "name_exp");

  let color = exp.color;
  if ( sessionStorage.getItem(exp.name) != undefined && sessionStorage.getItem(exp.name) != exp.color ) {
    color = sessionStorage.getItem(exp.name);
  }
  let name = n_exp.append("text")
                  .attr("x", width)
                  .attr("y", height-30)
                  .attr("id", "name_"+exp.name+"_"+exp.strand)
                  .attr("class", "name_"+exp.name+"_"+exp.strand)
                  .style("fill", color)
                  .attr("font-size", "13")
                  .text(exp.name);

  d3.select('[id="'+exp.name+'_1"]').select("polyline")
                                    .style("stroke-width", 2);

  d3.select('[id="'+exp.name+'_-1"]').select("polyline")
                                     .style("stroke-width", 2);
}

// Mouse out event
function out(exp) {
  d3.select("#name_exp").remove();

  d3.select('[id="'+exp.name+'_1"]').select("polyline")
    .style("stroke-width", 1);

  d3.select('[id="'+exp.name+'_-1"]').select("polyline")
    .style("stroke-width", 1);
}

// About profile
export function click(exp) {

  // Modal size
  $('#aboutProfile').animate({height: 'auto', width: '600px'});

  // Description
  $("#name").html("Description of " + exp.name);
  $("#description").html(exp.desc);
  // Color
  let new_color = exp.new_color;
  if ( sessionStorage.getItem(exp.name) != undefined ) {
    new_color = sessionStorage.getItem(exp.name) ;
  }
  $('#colorDialogID').val(colorToHex(new_color));

  // Reload
  d3.select("#reload").on("click", function() {
    $('#colorDialogID').val(colorToHex(exp.color));
    exp.new_color = exp.color;
    $(jq('label_'+exp.name)).css('color', exp.new_color);
    $(jq('colorDialogID_'+exp.name)).val(colorToHex(exp.new_color));
    sessionStorage.setItem(exp.name, $('#colorDialogID').val());

    d3.select('[id="'+exp.name+'_1"]')
      .style("stroke", exp.new_color);

    d3.select('[id="'+exp.name+'_-1"]')
      .style("stroke", exp.new_color);
  });

  // Window Change color
  document.getElementById('colorDialogID').onchange = function() {

    exp.new_color = $('#colorDialogID').val();
    $(jq('label_'+exp.name)).css('color', exp.new_color);
    $(jq('colorDialogID_'+exp.name)).val(colorToHex(exp.new_color));
    sessionStorage.setItem(exp.name, $('#colorDialogID').val());

    d3.select('[id="'+exp.name+'_1"]')
      .style("stroke", exp.new_color);

    d3.select('[id="'+exp.name+'_-1"]')
      .style("stroke", exp.new_color);
  }

  // Button Change Color
  document.getElementById('changeColor').onclick = function(){

    if ( $('#colorDialogID').val() == exp.color ) {

      d3.select('[id="'+exp.name+'_1"]')
        .style("stroke", exp.color);

      d3.select('[id="'+exp.name+'_-1"]')
        .style("stroke", exp.color);

      exp.new_color = "";
      $(jq('colorDialogID_'+exp.name)).val(colorToHex(exp.color));
      sessionStorage.removeItem(exp.name);
    }
  }
}

function bound(value, min, max) {
  if ( value < min ) {
    return min;
  }
  if ( value > max ) {
    return max;
  }
  return value;
}

function colorToRGBA(color){
  
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function byteToHex(num) {
    return ('0'+num.toString(16)).slice(-2);
}

export function colorToHex(color){
    var rgba, hex;
    rgba = colorToRGBA(color);
    hex = [0,1,2].map(
        function(idx) { return byteToHex(rgba[idx]); }
        ).join('');
    return "#"+hex;
}
