//
//     name : transterm.js
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

export function draw_transterms(transterm, seq_start, seq_stop, w_size, startY, seq_size, g_transterm){
  
    let startX = 0; let stopX = 0;
    let y = 0; if ( transterm.complement == '-1' ) { y = 20; }

    let g_trans = g_transterm.append("g").attr("id", "transterm_"+transterm.name);

    // Start in
    if ( transterm.start <= seq_stop && transterm.start >= seq_start ) {
        startX = ((transterm.start - seq_start) * w_size) / seq_size;
    }
    // Start out
    else {
      startX = 0;

      if ( transterm.complement == 1 ) {
        var points = g_trans.append("text");
        points.attr("x", startX+15)
              .attr("y", startY-3)
              .text("...")
              .style("fill", transterm.color)
              .style("stroke", transterm.color);
      }
      else {
        var points = g_trans.append("text");
        points.attr("x", startX+15)
              .attr("y", startY+5)
              .text("...")
              .style("fill", transterm.color)
              .style("stroke", transterm.color);
      }
    }

		// Stop in
    if ( transterm.stop <= seq_stop && transterm.stop >= seq_start ) {
      stopX = ((transterm.stop - seq_start) * w_size) / seq_size;
    }
    // Stop out
    else {
      stopX = 1140;

      if ( transterm.complement == 1 ) {
        var points = g_trans.append("text");
        points.attr("x", stopX+35)
              .attr("y", startY-3)
              .text("...")
              .style("fill", transterm.color)
              .style("stroke", transterm.color);
      }
      else {
        var points = g_trans.append("text");
        points.attr("x", stopX+35)
              .attr("y", startY+5)
              .text("...")
              .style("fill", transterm.color)
              .style("stroke", transterm.color);
      }
    }

    if ( transterm.complement == 1 ) {

      var f_trans = g_trans.append("rect")
                           .attr("x", startX+30)
                           .attr("y", startY-transterm.thickness*10)
                           .attr("width", stopX-startX+1)
                           .attr("height", transterm.thickness*10)
                           .style("fill", "none")
                           .style("stroke", transterm.color);
    }
    else {

      var f_trans = g_trans.append("rect")
                           .attr("x", startX+30)
                           .attr("y", startY)
                           .attr("width", stopX-startX+1)
                           .attr("height", transterm.thickness*10)
                           .style("fill", "none")
                           .style("stroke", transterm.color);
    }
}
