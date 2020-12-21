//
//     name : samples.js
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

import { check_version } from './checking.js';
import { add_feat_name, check_size_svg } from '../event.js';
import { get_selectedexp } from '../svg.js';
import { click, colorToHex } from './profiles.js';

check_version();

// Session Storage Samples
if ( sessionStorage.getItem("samples") == null ) {
  sessionStorage.setItem("samples", JSON.stringify(samples));
  if ( selexp == '' ) {
    for ( let i=0 ; i < samples.length ; i++ ) {
      sessionStorage.setItem("check_"+samples[i].name, samples[i].info);
    }
  }
  else {
    for ( let i=0 ; i < samples.length ; i++ ) {
      if ( sessionStorage.getItem("check_"+samples[i].name) != 1 ) {
        sessionStorage.removeItem("check_"+samples[i].name);
      }
    }
  }
}
var local_samples = JSON.parse(sessionStorage.getItem("samples"));

if ( sessionStorage.getItem("groups") == null ) {
  sessionStorage.setItem("groups", JSON.stringify(groups));
}
var local_groups = JSON.parse(sessionStorage.getItem("groups"));

if ( sessionStorage.getItem("rho_group_desc") == null ) {
  sessionStorage.setItem("rho_group_desc", JSON.stringify(rho_group_desc));
}
var local_rho_group_desc = JSON.parse(sessionStorage.getItem("rho_group_desc"));

// Samples selection
listViewHTML();
function gridViewHTML() {
  let test = '';
  let count = 0;
  let check = '';

  for ( let i=0 ; i < local_samples.length ; i++ ) {

    count = count + 1;
    check = '';
    let exp = local_samples[i];

    let color = exp.color;
    if ( sessionStorage.getItem(exp.name) != undefined && sessionStorage.getItem(exp.name) != exp.color ) {
      color = sessionStorage.getItem(exp.name);
      exp.new_color = sessionStorage.getItem(exp.name);
    }

    if ( sessionStorage.getItem("listExpChecked") != undefined ) {
      if ( sessionStorage.getItem("listExpChecked").includes(exp.name) == true || sessionStorage.getItem("check_"+exp.name) == 1 ) {
        check = 'checked';
      }
    }
    else {
      if ( sessionStorage.getItem("check_"+exp.name) == 1 )  { check = 'checked'; }
    }

    if ( count == 1 ) {
      test += "<div class='row justify-content-center'><div class='column'>";
      test += "<input type='checkbox' id='id_"+exp.name+"' name='sample' value='"+exp.name+"' "+check+">";
      test += "&nbsp;<label name='sample' id='label_"+exp.name+"' style='color:"+color+"'>"+exp.name+"</label>";
      // Test
      test += "&nbsp;<input type='color' id='colorDialogID_"+exp.name+"' name='color_sample' value='"+color+"'></td>";
      test += "&nbsp;<svg id='reload_"+exp.name+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
              <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
              <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
              </svg>";

      test += "</div>";
    }
    else if ( count == 6 ) {
      count = 0;
      test += "<div class='column'>";
      test += "<input type='checkbox' id='id_"+exp.name+"' name='sample' value='"+exp.name+"' "+check+">";
      test += "&nbsp;<label name='sample' id='label_"+exp.name+"' style='color:"+color+"'>"+exp.name+"</label>";
      test += "&nbsp;<input type='color' id='colorDialogID_"+exp.name+"' name='color_sample' value='"+color+"'></td>";
      test += "&nbsp;<svg id='reload_"+exp.name+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
              <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
              <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
              </svg>";
      test += "</div></div>";
    }
    else {
      test += "<div class='column'>";
      test += "<input type='checkbox' id='id_"+exp.name+"' name='sample' value='"+exp.name+"' "+check+">";
      test += "&nbsp;<label name='sample' id='label_"+exp.name+"' style='color:"+color+"'>"+exp.name+"</label>";
      test += "&nbsp;<input type='color' id='colorDialogID_"+exp.name+"' name='color_sample' value='"+color+"'></td>";
      test += "&nbsp;<svg id='reload_"+exp.name+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
              <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
              <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
              </svg>";
      test += "</div>";
    }
  }
  test += "</div>";
  $("#samplesList").html(test);

  // Add Click on Experience name
  for ( let i=0 ; i < local_samples.length ; i++ ) {

    let exp = local_samples[i];
    d3.select(jq('reload_'+exp.name)).on("click", function() {
      exp.new_color = exp.color;
      $(jq('label_'+exp.name)).css('color', exp.new_color);
      $(jq('colorDialogID_'+exp.name)).val(colorToHex(exp.new_color));
      sessionStorage.setItem(exp.name, $(jq('colorDialogID_'+exp.name)).val());

      d3.select('[id="'+exp.name+'_1"]')
        .style("stroke", exp.new_color);

      d3.select('[id="'+exp.name+'_-1"]')
        .style("stroke", exp.new_color);
    });
    $(jq('id_'+exp.name)).on("click", function() { add(exp.name, 'id_'+exp.name); } );
    $(jq('colorDialogID_'+exp.name)).on("change", function() { get_color(exp, this.id); });
  }
}
function listViewHTML() {

  let test = "<table id='samples' class='display' style='width:100%'> \
              <thead><tr> \
              <th width='50px'></th> \
              <th>Group</th> \
              <th>Description</th> \
              </tr></thead>";

  for ( let i = 0 ; i < Object.keys(local_groups).length ; i++ ) {

    let group = Object.keys(local_groups)[i];
    let list_exp = local_groups[group];
    let list_name_exp = Object.keys(list_exp);
    let desc = list_exp[list_name_exp[0]].desc;

    test += "<tr id='"+group.replaceAll(/\s/gi, '_')+"'><td id='"+group.replaceAll(/\s/gi, '_')+"' class='details-control'></td>";
    test += "<td width='25%'><input type='checkbox' id='id_"+group.replaceAll(/\s/gi, '_')+"' name='"+group.replaceAll(/\s/gi, '_')+"' value='"+group+"'>";
    test += "&nbsp;<label name='group' id='label_"+group.replaceAll(/\s/gi, '_')+"'>"+group+"</label>";
    test += "<td><div class='module'> \
             <div align='justify' class='collapse' id='collapseExample_"+i+"' aria-expanded='false'> \
             " + desc + "</div> \
             <center><a role='button' class='collapsed text-info' data-toggle='collapse' href='#collapseExample_"+i+"' \
             aria-expanded='false' aria-controls='collapseExample_"+i+"'></a></center> \
             </div></td></tr>";
  }

  test += "</table>";
  $("#samplesList").html(test);
  var table = $('#samples').DataTable({
    "columnDefs": [
      { "width": "5%", "targets": 0, "orderable": false },
      { "width": "25%", "targets": 1 }
    ]
  });

  function format ( d, id ) {

    let group = id;
    let list_exp = local_groups[group.replaceAll('_', ' ')];
    let list_name_exp = Object.keys(list_exp);

    let tmp_name = '';
    let tmp = '';
    let count = 0;

    for ( let i = 0 ; i < list_name_exp.length ; i++ ) {

      let color = list_exp[list_name_exp[i]].color;
      if ( sessionStorage.getItem(list_exp[list_name_exp[i]].name) != undefined && sessionStorage.getItem(list_exp[list_name_exp[i]].name) != list_exp[list_name_exp[i]].color ) {
        color = sessionStorage.getItem(list_exp[list_name_exp[i]].name);
        list_exp[list_name_exp[i]].new_color = sessionStorage.getItem(list_exp[list_name_exp[i]].name);
      }

      // New group or 1st group
      if ( list_exp[list_name_exp[i]].name.split('_')[0] != tmp_name ) {

        let r_color = list_exp[list_name_exp[i]].rcolor;
        if ( sessionStorage.getItem(list_exp[list_name_exp[i]].name.split('_')[0]) != undefined ) {
          r_color = sessionStorage.getItem(list_exp[list_name_exp[i]].name.split('_')[0]);
        }

        count = count + 1;

        if ( tmp_name != '' ) {
          tmp += "</div>";

          if ( count == 6 ) { tmp += "</div>"; count = 1; }
        }

        if ( count == 1 ) { tmp += "<div class='row'>"; }

        tmp += "<div class='column2'>";
        tmp += "<input type='checkbox' id='id_"+list_exp[list_name_exp[i]].name.split('_')[0]+"' name='group_"+group+"_"+list_exp[list_name_exp[i]].name.split('_')[0]+"' value='"+list_exp[list_name_exp[i]].name.split('_')[0]+"'>&nbsp;";
        tmp += "&nbsp;<label name='sample' id='llabel_"+list_exp[list_name_exp[i]].name.split('_')[0]+"' style='color:"+r_color+"'>"+list_exp[list_name_exp[i]].name.split('_')[0]+"</label>";
        tmp += "&nbsp;<input type='color' id='colorDialogID_"+list_exp[list_name_exp[i]].name.split('_')[0]+"' name='color_group' value='"+r_color+"'></td>";

        tmp += "&nbsp;<svg id='reload_"+list_exp[list_name_exp[i]].name.split('_')[0]+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
                <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
                <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
                </svg>";

        tmp += "<br/>&nbsp;&nbsp;&nbsp;" + "<input type='checkbox' id='"+list_exp[list_name_exp[i]].name+"' name='"+group+"_"+list_exp[list_name_exp[i]].name.split('_')[0]+"_sample' value='"+list_exp[list_name_exp[i]].name+"'>";
        tmp += "&nbsp;<label name='sample' id='label_"+list_exp[list_name_exp[i]].name+"' style='color:"+color+"'>"+list_exp[list_name_exp[i]].name+"</label>";
        tmp += "&nbsp;<input type='color' id='colorDialogID_"+list_exp[list_name_exp[i]].name+"' name='color_sample' value='"+color+"'></td>";

        tmp += "&nbsp;<svg id='reload_"+list_exp[list_name_exp[i]].name+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
                <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
                <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
                </svg>";

        tmp_name = list_exp[list_name_exp[i]].name.split('_')[0];
      }
      // Group (continue)
      else {
        tmp += "<br/>&nbsp;&nbsp;&nbsp;" + "<input type='checkbox' id='"+list_exp[list_name_exp[i]].name+"' name='"+group+"_"+list_exp[list_name_exp[i]].name.split('_')[0]+"_sample' value='"+list_exp[list_name_exp[i]].name+"'>";
        tmp += "&nbsp;<label name='sample' id='label_"+list_exp[list_name_exp[i]].name+"' style='color:"+color+"'>"+list_exp[list_name_exp[i]].name+"</label>";
        tmp += "&nbsp;<input type='color' id='colorDialogID_"+list_exp[list_name_exp[i]].name+"' name='color_sample' value='"+color+"'></td>";

        tmp += "&nbsp;<svg id='reload_"+list_exp[list_name_exp[i]].name+"' width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> \
                <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/> \
                <path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/> \
                </svg>";
      }
    }
    tmp += "</div></div>";

      return tmp;
  }

  $('#samples tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var id = table.row( this ).id();

        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data(), id) ).show();

            // Add Click on Exp name
            let list_exp = local_groups[id.replaceAll('_', ' ')];
            let list_name_exp = Object.keys(list_exp);
            let exp_name;
            let tmp_name = '';
            let check = '';
            for ( let i=0 ; i < list_name_exp.length ; i++ ) {

              $(jq(list_exp[list_name_exp[i]].name)).on("click", function() { check_exp(this.id, id); });
              $(jq('colorDialogID_'+list_exp[list_name_exp[i]].name)).on("change", function() { get_color(list_exp[list_name_exp[i]], this.id); });
              d3.select(jq('reload_'+list_exp[list_name_exp[i]].name)).on("click", function() {
                list_exp[list_name_exp[i]].new_color = list_exp[list_name_exp[i]].color;
                $(jq('label_'+list_exp[list_name_exp[i]].name)).css('color', list_exp[list_name_exp[i]].new_color);
                $(jq('colorDialogID_'+list_exp[list_name_exp[i]].name)).val(colorToHex(list_exp[list_name_exp[i]].new_color));
                sessionStorage.setItem(list_exp[list_name_exp[i]].name, $(jq('colorDialogID_'+list_exp[list_name_exp[i]].name)).val());

                d3.select('[id="'+list_exp[list_name_exp[i]].name+'_1"]')
                  .style("stroke", list_exp[list_name_exp[i]].new_color);

                d3.select('[id="'+list_exp[list_name_exp[i]].name+'_-1"]')
                  .style("stroke", list_exp[list_name_exp[i]].new_color);
              });

              if ( list_exp[list_name_exp[i]].name.split('_')[0] != tmp_name ) {

                d3.select(jq('reload_'+list_exp[list_name_exp[i]].name.split('_')[0])).on("click", function() {

                  $("input[id*='colorDialogID_"+list_exp[list_name_exp[i]].name.split('_')[0]+"']").each(function() {

                    let name = this.id.replace("colorDialogID_", "");

                    if ( name ==  list_exp[list_name_exp[i]].name.split('_')[0] ) {
                      $(jq(this.id)).val(colorToHex(list_exp[list_name_exp[i]].rcolor));
                      sessionStorage.setItem(name, list_exp[list_name_exp[i]].rcolor);
                      $(jq('llabel_'+name)).css('color', list_exp[list_name_exp[i]].rcolor);
                    }
                    else {
                      list_exp[name].new_color = list_exp[name].color;
                      sessionStorage.setItem(name, list_exp[name].color);
                      $(jq(this.id)).val(colorToHex(list_exp[name].color));
                      $(jq('label_'+name)).css('color', list_exp[name].color);

                      d3.select('[id="'+name+'_1"]')
                        .style("stroke", list_exp[name].color);

                      d3.select('[id="'+name+'_-1"]')
                        .style("stroke", list_exp[name].color);
                    }
                	});
                });

                if ( tmp_name != '' ) { check_exps(id, tmp_name); }

                tmp_name = list_exp[list_name_exp[i]].name.split('_')[0];
                $(jq('id_'+tmp_name)).on("click", function() { check_all_exp(this.value, id); });
                $(jq('colorDialogID_'+tmp_name)).on("change", function() { get_color_group(this.id); });
                if ( sessionStorage.getItem(tmp_name) != undefined ) {
                  $(jq('colorDialogID_'+tmp_name)).val(sessionStorage.getItem(tmp_name));
                }
              }

              let color = list_exp[list_name_exp[i]].color;
              if ( sessionStorage.getItem(list_exp[list_name_exp[i]].name) != undefined && sessionStorage.getItem(list_exp[list_name_exp[i]].name) != list_exp[list_name_exp[i]].color ) {
                color = sessionStorage.getItem(list_exp[list_name_exp[i]].name);
                list_exp[list_name_exp[i]].new_color = sessionStorage.getItem(list_exp[list_name_exp[i]].name);
                // Changer color
                $(jq('colorDialogID_'+list_exp[list_name_exp[i]].name)).val(colorToHex(list_exp[list_name_exp[i]].new_color));
              }
              if ( sessionStorage.getItem("listExpChecked") != undefined ) {
                if ( sessionStorage.getItem("listExpChecked").includes(list_exp[list_name_exp[i]].name) == true || sessionStorage.getItem("check_"+list_exp[list_name_exp[i]].name) == 1) {
                  $(jq(list_exp[list_name_exp[i]].name)).prop('checked', true);
                }
              }
              else {
                if ( sessionStorage.getItem("check_"+list_exp[list_name_exp[i]].name) == 1 )  { $(jq(list_exp[list_name_exp[i]].name)).prop('checked', true); }
              }
            }

            // Check Last Exp of this group
            check_exps(id, tmp_name);

            tr.addClass('shown');
        }
    } );

  // Add Click on Group name
  for ( let i=0 ; i < Object.keys(local_groups).length ; i++ ) {

    let group = Object.keys(local_groups)[i];
    $(jq('id_'+group.replaceAll(/\s/gi, '_'))).on("click", function() { check_all_group(group); });

    // Check exps of this group
    check_group(group.replaceAll(/\s/gi, '_'));
  }
}
function add(exp_name, exp_id) {

  if ( $(jq(exp_id)).is(':checked') ) {
    $(jq(exp_id)).prop('checked', true);
    sessionStorage.setItem("check_"+exp_name, 1);
  }
  else {
    sessionStorage.setItem("check_"+exp_name, 0);
    $(jq(exp_id)).prop('checked', false);
  }

  return true;
}
function get_color(exp, id) {

  exp.new_color = $(jq(id)).val();
  $(jq('label_'+exp.name)).css('color', exp.new_color);
  sessionStorage.setItem(exp.name, exp.new_color);

  d3.select('[id="'+exp.name+'_1"]')
    .style("stroke", exp.new_color);

  d3.select('[id="'+exp.name+'_-1"]')
    .style("stroke", exp.new_color);
}
function get_color_group(id) {

  let new_color = $(jq(id)).val();
  $("input[id*='"+id+"']").each(function() {
    let tmp = this.id.replace('colorDialogID_', '');
    $(jq(this.id)).val(new_color);
    sessionStorage.setItem(tmp, new_color);

    d3.select('[id="'+tmp+'_1"]')
      .style("stroke", new_color);

    d3.select('[id="'+tmp+'_-1"]')
      .style("stroke", new_color);
  });
  $("label[id*='label_"+id.replace('colorDialogID_', '')+"']").each(function() {
    $(jq(this.id)).css('color', new_color);
  });
}
function check_all_group(group) {

  group = group.replaceAll(/\s/gi, '_');

  if ( $(jq('id_'+group)).is(':checked') ) {
    $("input[name*='"+group+"']").each(function() {
			this.checked = true;
		});

    let list_exp = local_groups[group.replaceAll('_', ' ')]; // group with space
    let list_name_exp = Object.keys(list_exp);
    for ( let i=0 ; i < list_name_exp.length ; i++ ) {
      sessionStorage.setItem("check_"+list_exp[list_name_exp[i]].name, 1);
    }
  }
  else {
    $("input[name*='"+group+"']").removeAttr('checked');
    let list_exp = local_groups[group.replaceAll('_', ' ')]; // group with space
    let list_name_exp = Object.keys(list_exp);
    for ( let i=0 ; i < list_name_exp.length ; i++ ) {
      sessionStorage.setItem("check_"+list_exp[list_name_exp[i]].name, 0);
    }
  }

  return true;
}
function check_all_exp(tmp_exp, group) {

  if ( $(jq('id_'+tmp_exp)).is(':checked') ) {
    $("input[name*='"+tmp_exp+"_sample']").each(function() {
			this.checked = true;
      sessionStorage.setItem("check_"+this.value, 1);
		});
  }
  else {
    $("input[name*='"+tmp_exp+"_sample']").each(function() {
      sessionStorage.setItem("check_"+this.value, 0);
		});
    $("input[name*='"+tmp_exp+"_sample']").removeAttr('checked');
    $("input[name='"+group+"']").removeAttr('checked');
  }

  check_group(group);

  return true;
}
// Click on checkbox replicat
function check_exp(exp, group){

  add(exp, exp);
  check_exps(group, exp);
  check_group(group);

  return true;
}
// Check All replicates of experience
function check_exps(group, exp) {

  if ( $('input[name*='+jq2(exp.split('_')[0])+'_sample]').length == $('input[name*='+jq2(exp.split('_')[0])+'_sample]:checked').length ) {
    $("input[name*='group_"+group+"_"+exp.split('_')[0]+"']").prop('checked', true);
  }
  else {
    $("input[name*='group_"+group+"_"+exp.split('_')[0]+"']").removeAttr('checked');
  }

  return true;
}
// Check Group
function check_group(group) {

  let verif = 0;
  let list_exp = local_groups[group.replaceAll('_', ' ')];
  let list_name_exp = Object.keys(list_exp);
  for ( let i=0 ; i < list_name_exp.length ; i++ ) {
    if ( sessionStorage.getItem("check_"+list_exp[list_name_exp[i]].name) == 0
    || sessionStorage.getItem("check_"+list_exp[list_name_exp[i]].name) == undefined
    || sessionStorage.getItem("check_"+list_exp[list_name_exp[i]].name) == '' ) {
      verif = 1;
    }
  }

  if ( verif == 0 ) {
    $("input[name='"+group+"']").prop('checked', true);
  }
  else {
    $("input[name='"+group+"']").removeAttr('checked');
  }

  return true;
}

listRhoSamples();
// Rho samples selection
function listRhoSamples() {
  let test = "<table id='rho_samples' class='display' style='width:100%'> \
              <thead><tr> \
              <th>Group</th> \
              <th>Description</th> \
              </tr></thead>";

  test += "<td width='15%'><input type='checkbox' id='id_rho_samples' name='checkrhosample'>";
  test += "&nbsp;<label name='group' id='label_rho_samples'><i>rho</i>-mutant</label>";
  test += "<td><div class='module'> \
           <div align='justify' class='collapse' id='collapseExample_"+i+"' aria-expanded='false'> \
           " + local_rho_group_desc + "</div> \
           <center><a role='button' class='collapsed text-info' data-toggle='collapse' href='#collapseExample_"+i+"' \
           aria-expanded='false' aria-controls='collapseExample_"+i+"'></a></center> \
           </div></td></tr>";

  test += "</table>";
  $("#RhoSamples").html(test);
  var table = $('#RhoSamples').DataTable({"paging":   false,
                                          "ordering": false,
                                          "info":     false,
                                          "searching": false});

  if ( sessionStorage.getItem("rho") == 'true' || rho == 'true' ) {
    $('#id_rho_samples').prop('checked', true);
    sessionStorage.setItem('rho', 'true');
  }
  else {
    $('#id_rho_samples').prop('checked', false);
    sessionStorage.setItem('rho', 'false');
  }
}

// Discard last changes
$('#discard').click(function() {

  $('input[type=checkbox]:checked').removeAttr('checked');

  if ( sessionStorage.getItem("listExpChecked") == null ) {
    for ( let i=0 ; i < local_samples.length ; i++ ) {

      let exp = local_samples[i];
      if ( exp.info == 1 )        { $(jq('id_'+exp.name)).prop('checked', true); } // sessionStorage.setItem("check_"+exp.name, exp.info);
      sessionStorage.setItem("check_"+exp.name, exp.info);
    }
  }
  else {
    let s_checked = sessionStorage.getItem("listExpChecked").replace('(', '').replace(')', '').replaceAll("'", "");
    let l_checked = s_checked.split(',');

    for ( i in sessionStorage ) {
      if ( i.includes("check_") ) {
        if ( l_checked.includes(i.replace("check_", "")) ) {
          sessionStorage.setItem(i, 1);
          $(jq('id_'+i.replace("check_", ""))).prop('checked', true);
        }
        else {
          sessionStorage.setItem(i, 0);
        }
      }
    }
  }

  var table = $('#samples').DataTable();
  table.rows().every( function () {
    this.child.hide();
    $('tr[role=row]').removeClass('shown');
  } );
});
// Default button
$("#default").click(function() {

  sessionStorage.removeItem("listExpChecked");

  $('input[type=checkbox]:checked').removeAttr('checked');

  for ( i in sessionStorage ) {
    if ( i.includes("check_") ) {
      sessionStorage.removeItem(i);
    }
  }

  for ( let i=0 ; i < local_samples.length ; i++ ) {

    let tmp = '';

    let exp = local_samples[i];
    if ( exp.info == 1 )        { $(jq('id_'+exp.name)).prop('checked', true); }
    sessionStorage.setItem("check_"+exp.name, exp.info);
    sessionStorage.setItem(exp.name, exp.color);
    // replicat color
    $(jq("label_"+exp.name)).css('color', exp.color);
    $(jq('colorDialogID_'+exp.name)).val(colorToHex(exp.color));
    d3.select('[id="'+exp.name+'_1"]')
      .style("stroke", exp.color);
    d3.select('[id="'+exp.name+'_-1"]')
      .style("stroke", exp.color);
    // group color
    if ( tmp != exp.name.split('_')[0] || i == local_samples.length-1 ) {
      tmp = exp.name.split('_')[0];
      $(jq('llabel_'+tmp)).css('color', exp.rcolor);
      $(jq('colorDialogID_'+tmp)).val(colorToHex(exp.rcolor));
      sessionStorage.setItem(tmp, exp.rcolor);
    }
  }

  var table = $('#samples').DataTable();
  table.rows().every( function () {
    this.child.hide();
    $('tr[role=row]').removeClass('shown');
  } );

  return(false);
});
// None button
$("#none").click(function() {

  sessionStorage.removeItem("listExpChecked");

  $('input[type=checkbox]:checked').removeAttr('checked');

  for ( let i=0 ; i < local_samples.length ; i++ ) {

    let exp = local_samples[i];
    sessionStorage.setItem("check_"+exp.name, 0);
  }

  return(false);
});
// All button
$("#all").click(function() {

  sessionStorage.removeItem("listExpChecked");

  $('input[type=checkbox]').prop('checked', true)

  for ( let i=0 ; i < local_samples.length ; i++ ) {

    let exp = local_samples[i];
    sessionStorage.setItem("check_"+exp.name, 1);
  }

  return(false);
});
// Apply button
$("#apply").click(function() {

  var i = [];
  var txt = "('";
  let tmp = 0;

  for ( i in sessionStorage ) {
    if ( i.includes("check_") && sessionStorage.getItem(i) == 1 ) {
      if ( tmp == 0 ) {
        tmp = 1;
        txt += i.replace("check_", "") +"'";
      }
      else {
        txt += ",'" + i.replace("check_", "")+"'";
      }
    }
  }

  txt += ")";

  if ( txt != "(')" ) {
    sessionStorage.setItem("listExpChecked", txt);
    get_selectedexp(sessionStorage.getItem("start"), (parseInt(sessionStorage.getItem("start"))+parseInt(sessionStorage.getItem("size"))-1), sessionStorage.getItem("norm"), sessionStorage.getItem("size"), txt);
  }
  else {
    alert("Please, select samples.");
    return(false);
  }
});

// List button
$( "#listView" ).click(function() {

  listViewHTML();
  return(false);
});
// Grid button
$( "#gridView" ).click(function() {

  gridViewHTML();
  return(false);
});

var container = $( "#btnContainer" );
var btns = $( ".btn" );
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = $( ".active" );
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

/* Escape special characters in id */
export function jq( myid ) {
    return "#" + myid.replaceAll( /(:|\.|\[|\]|,|=|@|\\|\/|\+)/g, "\\$1" );
}

export function jq2( myid ) {
    return myid.replaceAll( /(:|\.|\[|\]|,|=|@|\\|\/|\+)/g, "\\$1" );
}
