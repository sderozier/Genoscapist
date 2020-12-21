//
//     name : trans_units.js
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

export function draw_promotors(promotor, seq_start, seq_stop, w_size, startY, seq_size, g_promotor){

    let y = 0; let y2 = -2; if ( promotor.complement == '-1' ) { y = 20; y2 = 5; }
    let startX = 0; let stopX = 0; let coord = "";

    let g_prom = g_promotor.append("g").attr("id", "promotor_"+promotor.name);

    // Start in
    if ( promotor.start <= seq_stop && promotor.start >= seq_start ) {
      startX = ( (promotor.start - seq_start) * w_size) / seq_size;
    }
    // Start out
    else {
      startX = 0;

      var points = g_prom.append("text");
      points.attr("x", startX+15+y)
            .attr("y", startY+y2)
            .text("...");
    }

    // Stop in
    if ( promotor.stop <= seq_stop && promotor.stop >= seq_start ) {
      stopX = ( (promotor.stop - seq_start) * w_size) / seq_size;
    }
    // Stop out
    else {
      stopX = 1140;

      var points = g_prom.append("text");
      points.attr("x", startX+15+y)
            .attr("y", startY+y2)
            .text("...");
    }

    let startFlag = ((promotor.center - seq_start) * w_size) / seq_size;

    // Strand +
    if ( promotor.complement == '1' ) {
      coord += (startFlag+30)+","+(startY)+" ";
      coord += (startFlag+30)+","+(startY-20)+" ";
      coord += (startFlag+40)+","+(startY-20)+" ";
      coord += (startFlag+30)+","+(startY-12)+" ";

      // Flag base
			var b_prom = g_prom.append("rect")
                         .attr("x", startX+30)
                         .attr("y", startY-5)
                         .attr("width", stopX-startX+1)
                         .attr("height", 4)
                         .style("fill", promotor.color)
                         .style("stroke", promotor.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }
    // Strand -
    else {
      coord += (startFlag+30)+","+(startY)+" ";
      coord += (startFlag+30)+","+(startY+20)+" ";
      coord += (startFlag+20)+","+(startY+20)+" ";
      coord += (startFlag+30)+","+(startY+12)+" ";

      // Flag base
			var b_prom = g_prom.append("rect")
                         .attr("x", startX+30)
                         .attr("y", startY)
                         .attr("width", stopX-startX+1)
                         .attr("height", 4)
                         .style("fill", promotor.color)
                         .style("stroke", promotor.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }

    // Name
    var name = g_prom.append("text");
    let y_name = startY-40; let x_name = startX+30;
    if ( promotor.complement == '-1' ) { y_name += 90; x_name -= 10; y_name -= 2; }
    name.attr("x", x_name)
        .attr("y", y_name)
        .attr("class", "name")
        .style("fill", promotor.color)
        .attr("visibility", "hidden")
        .attr("font-size", "13")
        .text(promotor.name);

    // SVG writing
    if ( promotor.center <= seq_stop && promotor.center >= seq_start ) {
      var f_prom = g_prom.append("polygon")
                         .attr("points", coord)
                         .style("fill", promotor.color)
                         .style("stroke", promotor.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }
}

export function draw_terminators(terminator, seq_start, seq_stop, w_size, startY, seq_size, g_terminator){

    let y = 0; let y2 = -2; if ( terminator.complement == '-1' ) { y = 20; y2 = 5; }
    let startX = 0; let stopX = 0; let coord = "";

    let g_term = g_terminator.append("g").attr("id", "terminator_"+terminator.name);

    // Start in
    if ( terminator.start <= seq_stop && terminator.start >= seq_start ) {
      startX = ( (terminator.start - seq_start) * w_size) / seq_size;
    }
    // Start out
    else {
      startX = 0;

      var points = g_term.append("text");
      points.attr("x", startX+15)
            .attr("y", startY+y2)
            .text("...");
    }

    // Stop in
    if ( terminator.stop <= seq_stop && terminator.stop >= seq_start ) {
      stopX = ( (terminator.stop - seq_start) * w_size) / seq_size;
    }
    // Stop out
    else {
      stopX = 1140;

      var points = g_term.append("text");
      points.attr("x", startX+15+y)
            .attr("y", startY+y2)
            .text("...");
    }

    let startFlag = ((terminator.center - seq_start) * w_size) / seq_size;

    // Strand +
    if ( terminator.complement == '1' ) {
      coord += (startFlag+30)+","+(startY)+" ";
      coord += (startFlag+30)+","+(startY-15)+" ";
      coord += (startFlag+20)+","+(startY-15)+" ";
      coord += (startFlag+20)+","+(startY-7)+" ";
      coord += (startFlag+30)+","+(startY-7)+" ";

      // Flag base
			var b_term = g_term.append("rect")
                         .attr("x", startX+30)
                         .attr("y", startY-5)
                         .attr("width", stopX-startX+1)
                         .attr("height", 4)
                         .style("fill", terminator.color)
                         .style("stroke", terminator.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }
    // Strand -
    else {
      coord += (startFlag+30)+","+(startY)+" ";
      coord += (startFlag+30)+","+(startY+15)+" ";
      coord += (startFlag+40)+","+(startY+15)+" ";
      coord += (startFlag+40)+","+(startY+7)+" ";
      coord += (startFlag+30)+","+(startY+7)+" ";

      // Flag base
			var b_term = g_term.append("rect")
                         .attr("x", startX+30)
                         .attr("y", startY)
                         .attr("width", stopX-startX+1)
                         .attr("height", 4)
                         .style("fill", terminator.color)
                         .style("stroke", terminator.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }

    // Name
    var name = g_term.append("text");
    let y_name = startY-40; let x_name = startX+20;
    if ( terminator.complement == '-1' ) { y_name += 90; x_name += 10; y_name -= 2; }
    name.attr("x", x_name)
        .attr("y", y_name)
        .attr("class", "name")
        .style("fill", terminator.color)
        .attr("visibility", "hidden")
        .attr("font-size", "13")
        .text(terminator.name);

    // SVG writing
    if ( terminator.center <= seq_stop &&  terminator.center >= seq_start ) {
      var f_term = g_term.append("polygon")
                         .attr("points", coord)
                         .style("fill", terminator.color)
                         .style("stroke", terminator.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
    }
}

export function draw_lines(line, seq_start, seq_stop, w_size, startY, seq_size, g_line){
  
  let startX = 0; let stopX = 0;

  let f_line = g_line.append("g").attr("id", "line_"+line.id);

  // Start in && stop out
  if ( line.x2 > seq_stop && line.x1 <= seq_stop && line.x1 >= seq_start ) {
    stopX = 1140;
    startX = ( (line.x1 - seq_start) * w_size) / seq_size;
  }
  // Start out && stop in
  else if ( line.x1 < seq_start && line.x2 <= seq_stop && line.x2 >= seq_start ) {
    startX = 0;
    stopX = ( (line.x2 - seq_start) * w_size) / seq_size;
  }
  // Start && stop out
  else if ( line.x2 > seq_stop && line.x1 < seq_start ) {
    startX = 0;
    stopX = 1140;
  }
  // Start & stop in
  else {
    startX = ( (line.x1 - seq_start) * w_size) / seq_size;
    stopX = ( (line.x2 - seq_start) * w_size) / seq_size;
  }

  // Strand +
  if ( line.complement == 1 ) {

    f_line.append("line")
          .attr("x1", startX+30)
          .attr("y1", startY-25-(line.y1*50))
          .attr("x2", stopX+30)
          .attr("y2", startY-25-(line.y1*50))
          .style("stroke", line.color)
          .style("stroke-width", 1);
  }
  // Strand -
  else {
    f_line.append("line")
          .attr("x1", startX+30)
          .attr("y1", startY+25-(line.y1*50))
          .attr("x2", stopX+30)
          .attr("y2", startY+25-(line.y1*50))
          .style("stroke", line.color)
          .style("stroke-width", 1);
  }
}

// Mouse over event
function over(name) {
  name.attr("visibility","visible");
}

// Mouse out event
function out(name) {
  if ( sessionStorage.getItem("feat") == 'false' ) {
    name.attr("visibility","hidden");
  }
}
