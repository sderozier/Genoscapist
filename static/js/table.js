//
//     name : table.js
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

check_version();

sessionStorage.setItem("seqlen", seqlen);

$('#suppData').attr("href", path+"/supplementary-data");
$('#help').attr("href", path+"/help");
$('#contact').attr("href", path+"/contact");

$(document).ready( function () {
  $('#genes_table').DataTable( {
    "dom": '<"top"l>rt<"bottom"ip>',
    "lengthMenu": [[25, 50, 75, 100, -1], [25, 50, 75, 100, "All"]],
    "iDisplayLength": 25,
    searching: false,
    order: [[ 0, "asc" ]],
    columnDefs: [
      { "visible": false, targets: [0]}
    ]
  });
  $('#genes_table').show();
  $('#spinner').remove();
} );

// Click on Gene name
$("td#name").click(function(e) {
  sessionStorage.setItem("gene", $(this).html());
  $(this).css("font-weight","bold");
  location.assign(path+"/viewer/?id="+$(this).html());
  e.stopPropagation();
});

// Click on Locus tag
$("td#locustag").click(function(e) {
  sessionStorage.setItem("gene", $(this).html());
  $(this).css("font-weight","bold");
  location.assign(path+"/viewer/?id="+$(this).html());
  e.stopPropagation();
});

// Click on Cluster A
$("span#clustera").click(function(e) {
  $(this).css("font-weight","bold");
  location.assign(path+"/?cluster="+$(this).html());
  e.stopPropagation();
});

// Click on Cluster B
$("span#clusterb").click(function(e) {
  $(this).css("font-weight","bold");
  location.assign(path+"/?cluster="+$(this).html());
  e.stopPropagation();
});

// Click on Cluster C
$("span#clusterc").click(function(e) {
  $(this).css("font-weight","bold");
  location.assign(path+"/?cluster="+$(this).html());
  e.stopPropagation();
});

// Select Gene name or Locus tag in list
$( "#input_identifier" ).autocomplete({
  source: identifiers,
  select: function( event, ui ) {
    sessionStorage.setItem("gene", ui.item.value);
    location.assign(path+"/viewer/?id="+ui.item.value);
  }
});

// Select a position (kb)
$( "#position_submit" ).click(function() {
  location.assign(path+"/?position="+$( "#input_position" ).val()+'000');
});

// Select a cluster in list
$( "#input_cluster" ).autocomplete({
  source: clusters,
  select: function( event, ui ) {
    location.assign(path+"/?cluster="+ui.item.value);
  }
});
