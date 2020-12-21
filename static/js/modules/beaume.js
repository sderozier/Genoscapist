//
//     name : beaume.js
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

export function draw_beaume(beaume, seq_start, seq_stop, w_size, startY, seq_size, g_beaume_p){
  
  let y = 0; if ( beaume.complement == '-1' ) { y = 20; }
  let startX = 0; let stopX = 0;

  let g_beaume = g_beaume_p.append("g").attr("id", "beaume_"+beaume.name);

  // Start in
  if ( beaume.start <= seq_stop && beaume.start >= seq_start ) {
    startX = ( (beaume.start - seq_start) * w_size) / seq_size;
  }
  // Start out
  else {
    startX = 0;

    if ( beaume.complement == 1 ) {
      var points = g_beaume.append("text");
      points.attr("x", startX+15)
            .attr("y", startY+5)
            .text("...")
            .style("stroke", beaume.color)
            .style("fill", beaume.color);
    }
    else {
      var points = g_beaume.append("text");
      points.attr("x", startX+15)
            .attr("y", startY+25)
            .text("...")
            .style("stroke", beaume.color)
            .style("fill", beaume.color);
    }
  }

  // Stop in
  if ( beaume.stop <= seq_stop && beaume.stop >= seq_start ) {
    stopX = ( ( beaume.stop - seq_start ) * w_size) / seq_size;
  }
  // Stop out
  else {
    stopX = 1140;

    if ( beaume.complement == 1 ) {
      var points = g_beaume.append("text");
      points.attr("x", stopX+35)
            .attr("y", startY+5)
            .text("...")
            .style("stroke", beaume.color)
            .style("fill", beaume.color);
    }
    else {
      var points = g_beaume.append("text");
      points.attr("x", stopX+35)
            .attr("y", startY+25)
            .text("...")
            .style("stroke", beaume.color)
            .style("fill", beaume.color);
    }
  }

  // Beaume segment name
  let color = "white";
  if ( beaume.filled == "yes" )       { color = beaume.color; }
  var name = g_beaume.append("text");
  let y_name = startY-5;
  if ( beaume.complement == '-1' ) { y_name += 50; }
  name.attr("x", startX+30)
      .attr("y", y_name)
      .attr("class", "name")
      .style("fill", beaume.color)
      .attr("visibility", "hidden")
      .attr("font-size", "13")
      .text(beaume.name);

  // SVG writing
  var f_beaume = g_beaume.append("rect")
                         .attr("x", startX+30)
                        .attr("y", startY+y)
                        .attr("width", stopX-startX+1)
                        .attr("height", 10)
                        .style("fill", color)
                        .style("stroke", beaume.color)
                        .on("mouseover", function() { over(name); })
                        .on("mouseout", function() { out(name); });
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
