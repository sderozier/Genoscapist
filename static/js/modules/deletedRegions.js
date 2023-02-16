//
//     name : deletedRegions.js
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
export function draw_typeRegions(typeRegion, seq_start, seq_stop, w_size, startY, seq_size, g_region){

    let startX = 0; let stopX = 1140; //0

    let g_reg = g_region.append("g").attr("id", typeRegion.type+"_"+typeRegion.name);

    var defs = g_reg.append("defs");
    defs.append("pattern")
        .attr("id", "MS")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#5c5c5c')
        .attr('stroke-width', 1);
    defs.append("pattern")
        .attr("id", "MGP181")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#c9b500')
        .attr('stroke-width', 1);
    defs.append("pattern")
        .attr("id", "MGP192")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#009100')
        .attr('stroke-width', 1);
    defs.append("pattern")
        .attr("id", "MGP229")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#0024c9')
        .attr('stroke-width', 1);
    defs.append("pattern")
        .attr("id", "MGP234")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#bd0000')
        .attr('stroke-width', 1);
    defs.append("pattern")
        .attr("id", "MGP254")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternUnits", "userSpaceOnUse")
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#b50091')
        .attr('stroke-width', 1);

    let y = 0; let fill = "url(#MS)";
    if      ( typeRegion.name.includes("MGP181") == true )  { y += 50;  fill = "url(#MGP181)"; }
    else if ( typeRegion.name.includes("MGP192") == true )  { y += 100; fill = "url(#MGP192)"; }
    else if ( typeRegion.name.includes("MGP229") == true )  { y += 150; fill = "url(#MGP229)"; }
    else if ( typeRegion.name.includes("MGP234") == true )  { y += 200; fill = "url(#MGP234)"; }
    else if ( typeRegion.name.includes("MGP254") == true )  { y += 250; fill = "url(#MGP254)"; }

    // Start in
    if ( typeRegion.start <= seq_stop && typeRegion.start >= seq_start ) {
      startX = ( (typeRegion.start - seq_start) * w_size) / seq_size;
    }
    // Start out
    // else {
    //     var points = g_reg.append("text");
    //     points.attr("x", startX+15)
    //           .attr("y", startY+3+y) // 5
    //           .text("...")
    //           .style("stroke", typeRegion.color)
    //           .style("fill", typeRegion.color);
    // }

    // Stop in
    if ( typeRegion.stop <= seq_stop && typeRegion.stop >= seq_start ) {
      stopX = ( ( typeRegion.stop - seq_start ) * w_size) / seq_size;
    }
    // Stop out
    // else {
      // stopX = 1140;
    //
    //     var points = g_reg.append("text");
    //     points.attr("x", stopX+35)
    //           .attr("y", startY+3+y) // 5
    //           .text("...")
    //           .style("stroke", typeRegion.color)
    //           .style("fill", typeRegion.color);
    // }

    // // Name
    // var name = g_reg.append("text");
    // let y_name = startY-5;
    // name.attr("x", startX+30)
    //     .attr("y", y_name+y)
    //     .attr("class", "name")
    //     .style("fill", typeRegion.color)
    //     .attr("visibility", "hidden")
    //     .attr("font-size", "13")
    //     .text(typeRegion.name);

    if ( typeRegion.type == "hole" ) {
      // Name
      var name = g_reg.append("text");
      let y_name = startY-1; // startY-5 --> startY-12
      name.attr("x", startX+30+2) // startX+30
          .attr("y", y_name+y-2) // y_name+y
          .attr("class", "name")
          .style("fill", typeRegion.color)
          .attr("visibility", "hidden")
          .attr("font-size", "13")
          .text(typeRegion.name.replace('i', '\u0394'));

      var f_seg = g_reg.append("rect")
                       .attr("x", startX+30)
                       .attr("y", startY+y-1)
                       .attr("width", stopX-startX+1)
                       .attr("height", 6) // 4
                       .style("fill", "white")
                       .style("stroke", "white")
                       .on("mouseover", function() { over(name); })
                       .on("mouseout", function() { out(name); });

      var f_seg = g_reg.append("line")
                       .attr("x1", startX+30)
                       .attr("x2", stopX+30)
                       .attr("y1", startY+y+2) // 5
                       .attr("y2", startY+y+2) // 5
                       .style("fill", "white")
                       .style("stroke-dasharray","2") //5,5
                       .style("stroke", typeRegion.color)
                       .on("mouseover", function() { over(name); })
                       .on("mouseout", function() { out(name); });
    }
    else if ( typeRegion.type == "left scar" ) {
      var f_seg = g_reg.append("rect")
                       .attr("x", startX+30)
                       .attr("y", startY+y-1)
                       .attr("width", stopX-startX)
                       .attr("height", 6) // 4
                       .style("fill", "white")
                       .style("stroke", "white");
      // Name
      var name = g_reg.append("text");
      let y_name = startY+25; // startY-5;
      name.attr("x", startX+30+2) // startX+30
          .attr("y", y_name+y)
          .attr("class", "name")
          .style("fill", typeRegion.color)
          .attr("visibility", "hidden")
          .attr("font-size", "13")
          .text(typeRegion.name+" left scar");
      var points = (stopX+30) +","+(startY-7+y)+" "+
                   (startX+30)+","+(startY-7+y)+" "+
                   (startX+30)+","+(startY+10+y)+" "+
                   (stopX+30) +","+(startY+10+y);
      var f_seq = g_reg.append("polyline")
                       .attr("points", points)
                       .style("fill", fill)
                       .style("stroke", typeRegion.color)
                       .on("mouseover", function() { over(name); })
                       .on("mouseout", function() { out(name); });
    }
    else if ( typeRegion.type == "right scar" ) {
      var f_seg = g_reg.append("rect")
                       .attr("x", startX+30)
                       .attr("y", startY+y-1)
                       .attr("width", stopX-startX)
                       .attr("height", 6) // 4
                       .style("fill", "white")
                       .style("stroke", "white");
      // Name
      var name = g_reg.append("text");
      let y_name = startY+25; // startY-5;
      name.attr("x", startX+30+2) // startX+30
          .attr("y", y_name+y)
          .attr("class", "name")
          .style("fill", typeRegion.color)
          .attr("visibility", "hidden")
          .attr("font-size", "13")
          .text(typeRegion.name+" right scar");
      var points = (startX+30)+","+(startY-7+y) +" "+
                   (stopX+30) +","+(startY-7+y) +" "+
                   (stopX+30) +","+(startY+10+y)+" "+
                   (startX+30)+","+(startY+10+y);
      var f_seq = g_reg.append("polyline")
                       .attr("points", points)
                       .style("fill", fill)
                       .style("stroke", typeRegion.color)
                       .on("mouseover", function() { over(name); })
                       .on("mouseout", function() { out(name); });
    }
    else if ( typeRegion.type == "cassette" ) {
      // Name
      var name = g_reg.append("text");
      let y_name = startY+25; // startY-5;
      // let y_name = startY-1;
      name.attr("x", startX+30+2) // startX+30
          .attr("y", y_name+y-2) //y_name+y
          .attr("class", "name")
          .style("fill", typeRegion.color)
          .attr("visibility", "hidden")
          .attr("font-size", "13")
          .text(typeRegion.name); //+" K7");

      // Clear genomic region
      var f_seg = g_reg.append("rect")
                       .attr("x", startX+30)
                       .attr("y", startY+y-1)
                       .attr("width", stopX-startX)
                       .attr("height", 6) // 4
                       .style("fill", "white")
                       .style("stroke", "white")
                       .on("mouseover", function() { over(name); })
                       .on("mouseout", function() { out(name); });

      // K7 larger than deletion
      if ( (typeRegion.stop-typeRegion.start) >= (typeRegion.comments*2) ) {

        // Left K7
        var stop_left = 0;
        var rsize = parseInt(typeRegion.comments); // 1251 || 626
        if ( (typeRegion.start + rsize) >= seq_start && (typeRegion.start + rsize) <= seq_stop ) {
          stop_left = ( ( (typeRegion.start + rsize) - seq_start ) * w_size) / seq_size;
          var points = (stop_left+30) +","+(startY-7+y)+" "+
                       (startX+30)+","+(startY-7+y)+" "+
                       (startX+30)+","+(startY+10+y)+" "+
                       (stop_left+30) +","+(startY+10+y);
          var f_seq = g_reg.append("polyline")
                            .attr("points", points)
                            .style("fill", fill)
                            .style("stroke", typeRegion.color)
                            .on("mouseover", function() { over(name); })
                            .on("mouseout", function() { out(name); });
        }
        else if ( (typeRegion.start + rsize) >= seq_stop ) {
          stop_left = stopX;
          var points = (stop_left+30) +","+(startY-7+y)+" "+
                       (startX+30)+","+(startY-7+y)+" "+
                       (startX+30)+","+(startY+10+y)+" "+
                       (stop_left+30) +","+(startY+10+y);
          var f_seq = g_reg.append("polyline")
                            .attr("points", points)
                            .style("fill", fill)
                            .style("stroke", typeRegion.color)
                            .on("mouseover", function() { over(name); })
                            .on("mouseout", function() { out(name); });
        }

        // Right K7
        var start_right = 1140;
        if ( (typeRegion.stop - rsize) >= seq_start && (typeRegion.stop - rsize) <= seq_stop ) {
          start_right = ( ( (typeRegion.stop - rsize) - seq_start) * w_size) / seq_size;
          var points = (start_right+30)+","+(startY-7+y) +" "+
                       (stopX+30) +","+(startY-7+y) +" "+
                       (stopX+30) +","+(startY+10+y)+" "+
                       (start_right+30)+","+(startY+10+y);
          var f_seq = g_reg.append("polyline")
                            .attr("points", points)
                            .style("fill", fill)
                            .style("stroke", typeRegion.color)
                            .on("mouseover", function() { over(name); })
                            .on("mouseout", function() { out(name); });
        }
        else if ( (typeRegion.stop - rsize) < seq_start ) {
          start_right = startX;
          var points = (start_right+30)+","+(startY-7+y) +" "+
                       (stopX+30) +","+(startY-7+y) +" "+
                       (stopX+30) +","+(startY+10+y)+" "+
                       (start_right+30)+","+(startY+10+y);
          var f_seq = g_reg.append("polyline")
                            .attr("points", points)
                            .style("fill", fill)
                            .style("stroke", typeRegion.color)
                            .on("mouseover", function() { over(name); })
                            .on("mouseout", function() { out(name); });
        }

        // Between left and right K7
        var f_seg = g_reg.append("line")
                         .attr("x1", stop_left+30)
                         .attr("x2", start_right+30)
                         .attr("y1", startY+y+2) // 5
                         .attr("y2", startY+y+2) // 5
                         .style("fill", "white")
                         .style("stroke-dasharray","2") //5,5
                         .style("stroke", typeRegion.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
      }

      // K7 smaller than deletion
      else {

        var f_seg = g_reg.append("rect")
                         .attr("x", startX+30)
                         .attr("y", startY+y-7)
                         .attr("width", stopX-startX)
                         .attr("height", 17)
                         .style("fill", fill)
                         .style("stroke", typeRegion.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });

        var f_seg = g_reg.append("line")
                         .attr("x1", startX+30)
                         .attr("x2", startX+30+stopX-startX)
                         .attr("y1", startY+y+2) // 5
                         .attr("y2", startY+y+2) // 5
                         .style("fill", "white")
                         .style("stroke-dasharray","2") //5,5
                         .style("stroke", typeRegion.color)
                         .on("mouseover", function() { over(name); })
                         .on("mouseout", function() { out(name); });
      }
    }
}

export function draw_regions(seq_start, seq_stop, w_size, startY, seq_size, g_region, svg) {

  let startX = 0; let stopX = 1140;

  [0, 50, 100, 150, 200, 250].forEach(function(y) {
    let g_reg = g_region.append("g").attr("id", "region_"+y);
    var color = "#5c5c5c"; var id = "MS";
    if      ( y == 50 )   { color = "#c9b500"; id = "MGP181"; }
    else if ( y == 100 )  { color = "#009100"; id = "MGP192"; }
    else if ( y == 150 )  { color = "#0024c9"; id = "MGP229"; }
    else if ( y == 200 )  { color = "#bd0000"; id = "MGP234"; }
    else if ( y == 250 )  { color = "#b50091"; id = "MGP254"; }

    // Name
    var name = g_reg.append("text");
    let y_name = startY-12; // startY-5
    name.attr("x", startX+30) // startX+30+2
        .attr("y", y_name+y)
        .attr("class", "name")
        .style("fill", color)
        .attr("visibility", "hidden")
        .attr("font-size", "13")
        .text(id);

    // SVG writing
    var f_seg = g_reg.append("rect")
                     .attr("x", startX+30)
                     .attr("y", startY+y)
                     .attr("width", stopX-startX) // +1
                     .attr("height", 4) // 10
                     .style("fill", color)
                     .style("stroke", color)
                     .on("mouseover", function() { over(name); })
                     .on("mouseout", function() { out(name); });

    if ( seq_start > 1 ) {
      var points = g_reg.append("text");
      points.attr("x", startX+15)
            .attr("y", startY+3+y) // 5
            .text("...")
            .style("stroke", color)
            .style("fill", color);
    }
    if ( seq_stop < sessionStorage.getItem("seqlen") ) {
      var points = g_reg.append("text");
      points.attr("x", stopX+33) // +35
            .attr("y", startY+3+y) // 5
            .text("...")
            .style("stroke", color)
            .style("fill", color);
    }
  });
}

// Old version
export function draw_deletedRegions(deletedRegion, seq_start, seq_stop, w_size, startY, seq_size, g_region){

    let startX = 0; let stopX = 0;

    let g_reg = g_region.append("g").attr("id", "deletedregion_"+deletedRegion.name);

    let y = 0;
    if ( deletedRegion.name.includes("MGP181") == true )       { y += 50; }
    else if ( deletedRegion.name.includes("MGP192") == true )  { y += 100; }
    else if ( deletedRegion.name.includes("MGP229") == true )  { y += 150; }
    else if ( deletedRegion.name.includes("MGP234") == true )  { y += 200; }
    else if ( deletedRegion.name.includes("MGP254") == true )  { y += 250; }

    // Start in
    if ( deletedRegion.start <= seq_stop && deletedRegion.start >= seq_start ) {
      startX = ( (deletedRegion.start - seq_start) * w_size) / seq_size;
    }
    // Start out
    else {
        var points = g_reg.append("text");
        points.attr("x", startX+15)
              .attr("y", startY+3+y) // 5
              .text("...")
              .style("stroke", deletedRegion.color)
              .style("fill", deletedRegion.color);
    }

    // Stop in
    if ( deletedRegion.stop <= seq_stop && deletedRegion.stop >= seq_start ) {
      stopX = ( ( deletedRegion.stop - seq_start ) * w_size) / seq_size;
    }
    // Stop out
    else {
      stopX = 1140;

        var points = g_reg.append("text");
        points.attr("x", stopX+35)
              .attr("y", startY+3+y) // 5
              .text("...")
              .style("stroke", deletedRegion.color)
              .style("fill", deletedRegion.color);
    }

    // Name
    var name = g_reg.append("text");
    let y_name = startY-5;
    name.attr("x", startX+30)
        .attr("y", y_name+y)
        .attr("class", "name")
        .style("fill", deletedRegion.color)
        .attr("visibility", "hidden")
        .attr("font-size", "13")
        .text(deletedRegion.name.split("_")[0]);

    // SVG writing
    var f_seg = g_reg.append("rect")
                     .attr("x", startX+30)
                     .attr("y", startY+y)
                     .attr("width", stopX-startX+1)
                     .attr("height", 4) // 10
                     .style("fill", deletedRegion.color)
                     .style("stroke", deletedRegion.color)
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
