//
//     name : axis.js
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

// Axis graduation
export function axis_graduation(x0, x1) {

  let xstep_10 = Math.pow(10, Math.floor(Math.log10(x1 - x0)));
  let nticks_10_mean = (x1 - x0 + 1) / xstep_10;
  let nticks_target = 5;
  let adj_fact = [2, 1, 0.5, 0.2];
  let adj_ichoose_ref = 10000000;
  let adj_ichoose = 0;

  for ( let i = 0 ; i < adj_fact.length ; i++ ) {

    let tmp = Math.abs((nticks_10_mean / adj_fact[i]) - nticks_target);

    if ( tmp < adj_ichoose_ref ) {
      adj_ichoose_ref = tmp;
      adj_ichoose = i;
    }
  }

  let xstep_adj = xstep_10 * adj_fact[adj_ichoose];
  let xtick0_adj = Math.ceil(x0 / xstep_adj) * xstep_adj;
  let nintervals_adj = Math.floor((x1 - xtick0_adj) / xstep_adj);

  let txticks = [];

  // 1st position
  txticks.push(x0);

  for ( let i = 0; i <= nintervals_adj; i++ ) {
    txticks.push((xtick0_adj + i * xstep_adj));
  }

  if ( txticks[nintervals_adj + 1] != x1 )	{ txticks.push( x1); }

  return txticks;
}

// Axis genomic
export function genomic_axis(start, nb_pb, width, svg) {

  // Graduations
  let grad = axis_graduation(start, (start+nb_pb-1));

  // Axis
  svg.append("line")
   .attr("x1", 30)
   .attr("y1", 60)
   .attr("x2", width-30)
   .attr("y2", 60)
   .style("stroke", "rgb(0,0,0)")
   .style("stroke-width", 1);

  // Graduations
  for ( let i = 0 ; i < grad.length ; i++) {

    let w_size = width - 2 * 30;
    let x = ((grad[i] - start) * w_size) / nb_pb;

    let g_size = w_size / nb_pb;
    if ( Math.trunc(g_size) > 0 ) {
      svg.append("rect")
         .attr("x", x+30)
         .attr("y", 60)
         .attr("width", g_size)
         .attr("height", 4);
    }
    else {
      svg.append("line")
       .attr("x1", x+30)
       .attr("y1", 60)
       .attr("x2", x+30)
       .attr("y2", 60+5)
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1);
    }

    let txt_grad = Math.ceil(grad[i]).toString();
    let units = svg.append("text");
    units.attr("x", x-(txt_grad.length * 3) + g_size/2 + 30)
         .attr("y", 80)
         .style("fill", "rgb(0,0,0)")
         .attr("font-size", "13");
    units.text(txt_grad);
  }
}

// Axis transcription units
export function transcript_axis(startY, width, svg) {

  // Axis
  svg.append("line")
     .attr("x1", 30)
     .attr("y1", startY)
     .attr("x2", width-30)
     .attr("y2", startY)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
}

export function v_axis(min, max, svg, y) {

  let factor = 10;

  let grad = axis_graduation(min, max);
  let yb = 0;
  let space = 120;
  if ( sessionStorage.getItem("norm") != "CustomCDS" ) {
    yb = 80;
    space = 170;
    if ( name.includes("subtilis") ) { space = 150; }
  }
  else {
    if ( name.includes("aureus") ) { space = 140; }
  }

  // left
  svg.append("line")
     .attr("id", "left_plus")
     .attr("x1", 30)
     .attr("y1", y+120-(grad[grad.length-1]*factor+yb))
     .attr("x2", 30)
     .attr("y2", y+120-(grad[0]*factor+yb))
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
  svg.append("line")
     .attr("x1", 30)
     .attr("y1", y+120+space-(grad[grad.length-1]*factor+yb))
     .attr("x2", 30)
     .attr("y2", y+120+space-(grad[0]*factor+yb))
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);

   // right
   svg.append("line")
    .attr("x1", 1170)
    .attr("y1", y+120-(grad[grad.length-1]*factor+yb))
    .attr("x2", 1170)
    .attr("y2", y+120-(grad[0]*factor+yb))
    .style("stroke", "rgb(0,0,0)")
    .style("stroke-width", 1);
   svg.append("line")
    .attr("x1", 1170)
    .attr("y1", y+120+space-(grad[grad.length-1]*factor+yb))
    .attr("x2", 1170)
    .attr("y2", y+120+space-(grad[0]*factor+yb))
    .style("stroke", "rgb(0,0,0)")
    .style("stroke-width", 1);

   // Graduations
   for ( let i = 1 ; i < grad.length-1 ; i++) {

     // left
     svg.append("line")
        .attr("x1", 25)
        .attr("y1", y+120-(grad[i]*factor+yb))
        .attr("x2", 30)
        .attr("y2", y+120-(grad[i]*factor+yb))
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", 1);
     svg.append("line")
        .attr("x1", 25)
        .attr("y1", y+120+space-(grad[i]*factor+yb))
        .attr("x2", 30)
        .attr("y2", y+120+space-(grad[i]*factor+yb))
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", 1);

      if ( i == 1 || i == grad.length - 2 ) {

        let dec = 2;
        if ( i == 0 ) { dec = 5; }
        if ( i == grad.length - 1 ) { dec = -2; }
        let txt_grad = grad[i].toString();
        let units_l1 = svg.append("text");
        let x = 13; if ( txt_grad.length == 2 ) { x = 7; }
        units_l1.attr("x", x)
                .attr("y", y+120-(grad[i]*factor+yb) + dec)
                .style("fill", "rgb(0,0,0)")
                .attr("font-size", "13");
        units_l1.text(txt_grad);
        let units_l2 = svg.append("text");
        units_l2.attr("x", x)
                .attr("y", y+120+space-(grad[i]*factor+yb) + dec)
                .style("fill", "rgb(0,0,0)")
                .attr("font-size", "13");
        units_l2.text(txt_grad);

        let units_r1 = svg.append("text");
        units_r1.attr("x", 1177)
                .attr("y", y+120-(grad[i]*factor+yb) + dec)
                .style("fill", "rgb(0,0,0)")
                .attr("font-size", "13");
        units_r1.text(txt_grad);
        let units_r2 = svg.append("text");
        units_r2.attr("x", 1177)
                .attr("y", y+120+space-(grad[i]*factor+yb) + dec)
                .style("fill", "rgb(0,0,0)")
                .attr("font-size", "13");
        units_r2.text(txt_grad);
      }

      // right
      svg.append("line")
         .attr("x1", 1170)
         .attr("y1", y+120-(grad[i]*factor+yb))
         .attr("x2", 1175)
         .attr("y2", y+120-(grad[i]*factor+yb))
         .style("stroke", "rgb(0,0,0)")
         .style("stroke-width", 1);
      svg.append("line")
         .attr("x1", 1170)
         .attr("y1", y+120+space-(grad[i]*factor+yb))
         .attr("x2", 1175)
         .attr("y2", y+120+space-(grad[i]*factor+yb))
         .style("stroke", "rgb(0,0,0)")
         .style("stroke-width", 1);
   }

   // legend unit
   let y_txt = grad[grad.length-3];
   if ( sessionStorage.getItem("norm") != "CustomCDS" ) {
     y_txt = grad[grad.length-2];
   }
   let legend_l1 = svg.append("text");
   legend_l1.attr("x", 10)
            .attr("y", y+120-(y_txt*factor+yb)+20)
            .style("fill", "rgb(0,0,0)")
            .attr("transform", "rotate(-90,10,"+(y+120-(y_txt*factor+yb)+20)+")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13");
   legend_l1.text("log2(exp)");

   let legend_l2 = svg.append("text");
   legend_l2.attr("x", 10)
            .attr("y", y+120+space-(y_txt*factor+yb)+20)
            .style("fill", "rgb(0,0,0)")
            .attr("transform", "rotate(-90,10,"+(y+120+space-(y_txt*factor+yb)+20)+")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13");
   legend_l2.text("log2(exp)");

   let legend_r1 = svg.append("text");
   legend_r1.attr("x", 1194)
            .attr("y", y+120-(y_txt*factor+yb)+20)
            .style("fill", "rgb(0,0,0)")
            .attr("transform", "rotate(-90,1194,"+(y+120-(y_txt*factor+yb)+20)+")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13");
   legend_r1.text("log2(exp)");

   let legend_r2 = svg.append("text");
   legend_r2.attr("x", 1194)
            .attr("y", y+120+space-(y_txt*factor+yb)+20)
            .style("fill", "rgb(0,0,0)")
            .attr("transform", "rotate(-90,1194,"+(y+120+space-(y_txt*factor+yb)+20)+")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13");
   legend_r2.text("log2(exp)");
}

// Axis profiles
export function profile_min_axis(width, normalisation, svg, tmp, type) {

  let min = sessionStorage.getItem("min_"+normalisation);

  let factor = 10;
  let space = 0;

  if ( normalisation == "CustomCDS" ) {

    if ( name.includes("subtilis") ) { space = 120; }
    else                             { space = 140; }

    // Strand -
    let ymin = 120 + space - (min * factor);
    svg.append("line")
     .attr("id", type+"axeMinM")
     .attr("x1", 30).attr("y1", ymin+tmp)
     .attr("x2", width-30).attr("y2", ymin+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);

    // Strand +
    ymin = 120 - (min * factor);
    svg.append("line")
     .attr("id", type+"axeMinP")
     .attr("x1", 30).attr("y1", ymin+tmp)
     .attr("x2", width-30).attr("y2", ymin+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
  }

  else {

    let space = 170;
    if ( name.includes("subtilis") ) { space = 150; }

    // Strand -
    let ymin = 120 + space - min * factor - 80;
    svg.append("line")
     .attr("id", type+"axeMinM")
     .attr("x1", 30).attr("y1", ymin+tmp)
     .attr("x2", width-30).attr("y2", ymin+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);

    // Strand +
    ymin = 120 - min * factor - 80;
    svg.append("line")
     .attr("id", type+"axeMinP")
     .attr("x1", 30).attr("y1", ymin+tmp)
     .attr("x2", width-30).attr("y2", ymin+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
  }
}
export function profile_max_axis(width, normalisation, svg, tmp, type) {

  let max = sessionStorage.getItem("max_"+normalisation);

  let factor = 10;
  let space = 0;

  if ( normalisation == "CustomCDS" ) {

    if ( name.includes("subtilis") ) { space = 120; }
    else                             { space = 140; }

    // Strand -
    let ymax = 120 + space - (max * factor);
    svg.append("line")
     .attr("id", type+"axeMaxM")
     .attr("x1", 30).attr("y1", ymax+tmp)
     .attr("x2", width-30).attr("y2", ymax+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);

    // Strand +
    ymax = 120 - (max * factor);
    svg.append("line")
     .attr("id", type+"axeMaxP")
     .attr("x1", 30).attr("y1", ymax+tmp)
     .attr("x2", width-30).attr("y2", ymax+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
  }
  else {

    let space = 170;
    if ( name.includes("subtilis") ) { space = 150; }

    // Strand -
    let ymax = 120 + space - max * factor - 80;
    svg.append("line")
     .attr("id", type+"axeMaxM")
     .attr("x1", 30).attr("y1", ymax+tmp)
     .attr("x2", width-30).attr("y2", ymax+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);

    // Strand +
    ymax = 120 - max * factor - 80;
    svg.append("line")
     .attr("id", type+"axeMaxP")
     .attr("x1", 30).attr("y1", ymax+tmp)
     .attr("x2", width-30).attr("y2", ymax+tmp)
     .style("stroke", "rgb(0,0,0)")
     .style("stroke-width", 1);
  }
}
export function profile_axis(width, normalisation, svg, tmp) {

  let factor = 10;
  let space = 0;

  if ( normalisation == "CustomCDS") {

    if ( name.includes("subtilis") ) { space = 120; }
    else                             { space = 140; }

    // Strand -
    svg.append("line")
       .attr("id", "axe1")
       .attr("x1", 30).attr("y1", ((120 + space - (10 * factor))+tmp))
       .attr("x2", width-30).attr("y2", ((120 + space - (10 * factor))+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe2")
       .attr("x1", 30).attr("y1", ((120 + space - (11 * factor))+tmp))
       .attr("x2", width-30).attr("y2", ((120 + space - (11 * factor))+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');

    // Strand +
    svg.append("line")
       .attr("id", "axe1")
       .attr("x1", 30).attr("y1", ((120 - (10 * factor))+tmp))
       .attr("x2", width-30).attr("y2", ((120 - (10 * factor))+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe2")
       .attr("x1", 30).attr("y1", ((120 - (11 * factor))+tmp))
       .attr("x2", width-30).attr("y2", ((120 - (11 * factor))+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
  }

  else {

    let space = 170;
    if ( name.includes("subtilis") ) { space = 150; }

    // Strand -
    svg.append("line")
       .attr("id", "axe1")
       .attr("x1", 30).attr("y1", (120 + space - 0 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 + space - 0 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe2")
       .attr("x1", 30).attr("y1", (120 + space - 2.32 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 + space - 2.32 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe3")
       .attr("x1", 30).attr("y1", (120 + space - 3.32 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 + space - 3.32 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');

    // Strand +
    svg.append("line")
       .attr("id", "axe4")
       .attr("x1", 30).attr("y1", (120 - 2.32 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 - 2.32 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe5")
       .attr("x1", 30).attr("y1", (120 - 3.32 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 - 3.32 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
    svg.append("line")
       .attr("id", "axe6")
       .attr("x1", 30).attr("y1", (120 - 0 * factor - 80+tmp))
       .attr("x2", width-30).attr("y2", (120 - 0 * factor - 80+tmp))
       .style("stroke", "rgb(0,0,0)")
       .style("stroke-width", 1)
       .style('stroke-dasharray', '5,5');
  }
}

// Vertical bar
export function get_vbar(position, svg, s_size, d_start) {

  d3.select("#repere").remove();

  sessionStorage.setItem("vBar", position);

  let g_rep = svg.append("g").attr("id", "repere");
  let grad = 1140 / s_size;
  let pos = (((position - d_start) * 1140) / s_size) + 30;
  let y2 = 56;

  let height = 800-y2;
  if ( sessionStorage.getItem("rho") == 'true' ) {
    if ( name.includes("subtilis") ) {
      if ( sessionStorage.getItem("norm") == 'CustomCDS' ) { height = 900-y2; }
      else { height = 1000-y2; }
    }
    else {
      if ( sessionStorage.getItem("norm") == 'CustomCDS' ) { height = 2000-y2; } // 1800
      else { height = 2300-y2; } // 1900
    }
  }
  else {
    if ( name.includes("aureus") ) {
      height = 900-y2;
    }
  }

  if ( path == "/smgeb" ) {
    height = 1000-y2;
  }

  // SVG writing
  if ( pos >= 30 && pos <= 1170 ) {
      var f_rep = g_rep.append("rect")
                       .attr("x", pos)
                       .attr("y", y2)
                       .attr("width", grad)
                       .attr("height", height)
                       .style("fill", "none")
                       .style("stroke", "purple")
                       .style("stroke-width", 0.75);

      // Text
      var v_name = g_rep.append("text");
      var legend = position.toString();

      v_name.attr("x", (pos - (legend.length) * 2.5) + grad/2)
            .attr("y", y2-6)
            .style("fill", "purple")
            .attr("font-size", "13")
            .text(position.toString());
    }
}
