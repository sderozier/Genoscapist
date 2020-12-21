//
//     name : cds.js
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

export function draw_cds(cds, seq_start, seq_stop, w_size, startY, seq_size, g_cds){
  
  let y = 0; if ( cds.complement == '-1' ) { y = 25; }
  let coord = ""; let startX = 0; let stopX = 0;
  let length =0;

  let g_feat = g_cds.append("g").attr("id", "cds_"+cds.name);

  // 1st case: start in & stop out
  if ( cds.stop > seq_stop && cds.start <= seq_stop && cds.start >= seq_start ) {

    startX = ((cds.start - seq_start) * w_size) / seq_size;
    stopX = 1170;
    length = stopX - startX

    // Strand -
    if ( cds.complement == '-1' ) {
      // Arrow
      if ( length >= 35 ) {

        coord += (stopX)+","+(startY+20+y)+" ";
        coord += (stopX)+","+(startY+10+y)+" ";
        coord += (startX+35)+","+(startY+10+y)+" ";
        coord += (startX+35)+","+(startY+5+y)+" ";
        coord += (startX+30)+","+(startY+15+y)+" ";
        coord += (startX+35)+","+(startY+25+y)+" ";
        coord += (startX+35)+","+(startY+20+y);
      }
      // Triangle
      else if ( length == 35 ) {
        coord += (startX+30+5)+","+(startY+5+y)+" ";
        coord += (startX+30)+","+(startY+15+y)+" ";
        coord += (startX+30+5)+","+(startY+25+y);
      }
      // Rectangle
      else {
        coord += (startX+30)+","+(startY+10+y)+" ";
        coord += (startX+30)+","+(startY+20+y)+" ";
        coord += (stopX)+","+(startY+20+y)+" ";
        coord += (stopX)+","+(startY+10+y);
      }
    }

    // Strand +
    else {
      coord += (startX+30)+","+(startY+10)+" ";
      coord += (startX+30)+","+(startY+20)+" ";
      coord += (stopX)+","+(startY+20)+" ";
      coord += (stopX)+","+(startY+10);
    }
  }

  // 2nd: start out & stop in
  else if ( cds.start < seq_start && cds.stop <= seq_stop && cds.stop >= seq_start ) {

    startX = 0;
    stopX = ((cds.stop - seq_start) * w_size) / seq_size;
    length = stopX - startX

    // Strand +
    if ( cds.complement == 1 ) {
      // Arrow
      if ( length >= 5 ) {
        coord += (startX+30)+","+(startY+20)+" ";
        coord += (startX+30)+","+(startY+10)+" ";
        coord += (stopX+25)+","+(startY+10)+" ";
        coord += (stopX+25)+","+(startY+5)+" ";
        coord += (stopX+30)+","+(startY+15)+" ";
        coord += (stopX+25)+","+(startY+25)+" ";
        coord += (stopX+25)+","+(startY+20);
      }
      // Triangle
      else if ( length == 5 ) {
        coord += (stopX+30-5)+","+(startY+5)+" ";
        coord += (stopX+30)+","+(startY+15)+" ";
        coord += (stopX+30-5)+","+(startY+25);
      }
      // Rectangle
      else {
        coord += (startX+30)+","+(startY+10+y)+" ";
        coord += (startX+30)+","+(startY+20+y)+" ";
        coord += (startX+30+length+1)+","+(startY+20+y)+" ";
        coord += (startX+30+length+1)+","+(startY+10+y);
      }
    }

    // Strand -
		else {
      coord += (startX+30)+","+(startY+10+y)+" ";
      coord += (startX+30)+","+(startY+20+y)+" ";
      coord += (startX+30+length+1)+","+(startY+20+y)+" ";
      coord += (startX+30+length+1)+","+(startY+10+y);
    }
  }

  // 3rd case: start & stop out
  if ( cds.start < seq_start && cds.stop > seq_stop ) {

    startX = 0;
    stopX = 1170;
    // Rectangle
    coord += (startX+30)+","+(startY+10+y)+" ";
    coord += (startX+30)+","+(startY+20+y)+" ";
    coord += (stopX)+","+(startY+20+y)+" ";
    coord += (stopX)+","+(startY+10+y);
  }

  // 4th case: start & stop in
  else if ( cds.start >= seq_start && cds.stop >= seq_start && cds.start <= seq_stop && cds.stop <= seq_stop ) {

    startX = ((cds.start - seq_start) * w_size) / seq_size;
    stopX = ((cds.stop - seq_start) * w_size) / seq_size;
    length = stopX - startX

    // Strand +
    if ( cds.complement == 1 ) {
      // Arrow
      if ( length >= 5 ) {
        coord += (startX+30)+","+(startY+20)+" ";
  			coord += (startX+30)+","+(startY+10)+" ";
  			coord += (stopX+25)+","+(startY+10)+" ";
  			coord += (stopX+25)+","+(startY+5)+" ";
  			coord += (stopX+30)+","+(startY+15)+" ";
  			coord += (stopX+25)+","+(startY+25)+" ";
  			coord += (stopX+25)+","+(startY+20);
      }
      // Triangle
      else if ( length == 5 ) {
        coord += (stopX+25)+","+(startY+5)+" ";
				coord += (stopX+30)+","+(startY+15)+" ";
				coord += (stopX+25)+","+(startY+25);
      }
      // Rectangle
      else {
        coord += (startX+30)+","+(startY+10)+" ";
        coord += (startX+30)+","+(startY+20)+" ";
        coord += (startX+30+length+1)+","+(startY+20)+" ";
        coord += (startX+30+length+1)+","+(startY+10);
      }
    }

    // Strand -
    else {
      // Arrow
      if ( length >= 5 ) {
        coord += (stopX+30)+","+(startY+20+y)+" ";
  			coord += (stopX+30)+","+(startY+10+y)+" ";
  			coord += (startX+35)+","+(startY+10+y)+" ";
  			coord += (startX+35)+","+(startY+5+y)+" ";
  			coord += (startX+30)+","+(startY+15+y)+" ";
  			coord += (startX+35)+","+(startY+25+y)+" ";
  			coord += (startX+35)+","+(startY+20+y);
      }
      // Triangle
      else if ( length == 5 ) {
        coord += (startX+35)+","+(startY+5+y)+" ";
        coord += (startX+30)+","+(startY+15+y)+" ";
        coord += (startX+25)+","+(startY+25+y);
      }
      // Rectangle
      else {
        coord += (startX+30)+","+(startY+10+y)+" ";
        coord += (startX+30)+","+(startY+20+y)+" ";
        coord += (startX+30+length+1)+","+(startY+20+y)+" ";
        coord += (startX+30+length+1)+","+(startY+10+y);
      }
    }
  }

  // Start points if start is out
  if ( cds.start < seq_start ) {

    var points = g_feat.append("text");
    points.attr("x", startX+15)
          .attr("y", startY+15+y)
          .attr("id", cds.name)
          .style("fill", "#1EB7D2")
          .text("...");
  }

  // Stop points if stop is out
  if ( cds.stop > seq_stop ) {

    var points = g_feat.append("text");
    points.attr("x", stopX+2)
          .attr("y", startY+15+y)
          .attr("id", cds.name)
          .style("fill", "#1EB7D2")
          .text("...");
  }

  // CDS name
  var name = g_feat.append("text");
  let y_name = 102+y;
  if ( cds.complement == '-1' ) { y_name += 35; }
  name.attr("x", startX+30)
      .attr("y", y_name)
      .attr("class", "name")
      .attr("id", cds.name)
      .style("fill", "#1EB7D2")
      .attr("visibility", "hidden")
      .attr("font-size", "13")
      .text(cds.name);

  // SVG writing
  var f_feat = g_feat.append("polygon")
                     .attr("points", coord)
                     .attr("id", cds.name)
                     .style("fill", "#1EB7D2")
                     .on("click", function() { click(cds, seq_size); })
                     .on("mouseover", function() { over(name, f_feat, points); })
                     .on("mouseout", function() { out(name, f_feat, points, cds); });
}

// Mouse click event
function click(cds, seq_size) {
  location.assign(path+"/viewer/?id="+cds.name+"&size="+seq_size);
}

// Mouse over event
function over(name, f_feat, points) {

  name.attr("visibility","visible");
  name.style("fill", "#8462B1");
  f_feat.style("fill", "#8462B1");
  if ( points != undefined ) {
    points.style("fill", "#8462B1");
  }
}

// Mouse out event
function out(name, f_feat, points, cds) {
  if ( sessionStorage.getItem("feat") == 'false' ) {
    name.attr("visibility","hidden");
  }

  if ( typeof gene === 'undefined' || gene === null || cds.name != gene.locustag ) {

    name.style("fill", "#1EB7D2");
    f_feat.style("fill", "#1EB7D2");
    if ( points != undefined ) {
      points.style("fill", "#1EB7D2");
    }
  }
}
