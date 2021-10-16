// created by McZazz, found at https://github.com/McZazz/nodeNotes
const nodeWidthOffset = 80;
const nodeHeightOffset = 38;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set scroll on refresh
let refreshScrollX = parseFloat(document.getElementById('scrollX').classList.item(0));
let refreshScrollY = parseFloat(document.getElementById('scrollY').classList.item(0));
// console.log(typeof refreshScrollY);
refreshScrollY = (Math.round(refreshScrollY*10))/10;
refreshScrollX = (Math.round(refreshScrollX*10))/10;
// console.log('refreshScroll: x: ' + refreshScrollX + ' Y: ' + refreshScrollY)

// console.log(            refreshScrollY             );

let justRefreshed = 'yup';

if (justRefreshed === 'yup') {
  window.scrollTo(refreshScrollX, refreshScrollY);
  // console.log('scroll has been fixed')
  justRefreshed = 'nope';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// global pos xy

let globalX = '';
let globalY = '';

let globalWirePosX = 0;
let globalWirePosY = 0;

document.addEventListener('mousemove', function(event) {

  // let pageX = event.pageX;
  // let pageY = event.pageY;
  // posArr.push({'pageX': pageX, 'pageY': pageY});
  // console.log(pageX + " " + pageY);
  // globalXY = {'pageX': pageX, 'pageY': pageY};
  globalX = event.pageX;
  globalY = event.pageY;
  // console.log(globalXY)

  ///////////////////////////////////////////////////////////////////////////////////
  /// MOVE HIDDEN NODE
  if (newNodePhase === 'on') {

    /// pos for wires
    let hiddenNode_posX = (globalX - move_node_offsetX - nodeWidthOffset).toString() + 'px';
    let hiddenNode_posY = (globalY - move_node_offsetY - nodeHeightOffset).toString() + 'px';
    document.getElementById('hidden_node').style.top = hiddenNode_posY;
    document.getElementById('hidden_node').style.left = hiddenNode_posX;
    // console.log('mioving hidden node')
  }

  ///////////////////////////////////////////////////////
  // MOVE ACTUAL NODE
  if (node_is_moving === true) {
    ////////////////////////////////
    // move the node
    move_dataX_var = globalX;
    move_dataY_var = globalY;
    // console.log(move_node_id +  ' is ffff moving, x: ' + move_dataX_var + ' y: ' + move_dataY_var);
    let move_node = document.getElementById(move_node_id);
    // console.log('why nan: ' + move_node_offsetX)
    // console.log(typeof move_node_offsetX)
    move_node.style.zIndex = 3;
    move_node.style.left = (move_dataX_var - move_node_offsetX).toString() + 'px';
    move_node.style.top = (move_dataY_var - move_node_offsetY).toString() + 'px';

    // pos for wires
    let wire_posX = (move_dataX_var - move_node_offsetX + nodeWidthOffset).toString() + 'px';
    let wire_posY = (move_dataY_var - move_node_offsetY + nodeHeightOffset).toString() + 'px';

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // update the wires
    // get all it's connected wires
    // console.log(wiresOfNodes[move_node_id].ins)

    // console.log(typeof move_dataX_var)
    ////////////////////////////////////////////////// get ins of wires, ins are 2 and 3...
    if (wiresOfNodes[move_node_id]) {

      let ins = wiresOfNodes[move_node_id].ins;      ////   each is an array, iterate and change to teh nodes loc + mid-node-offsets
      let outs = wiresOfNodes[move_node_id].outs;

      if (ins.length > 0) {
        for (var i = 0; i < ins.length; i++) {
          // console.log('ffffffffffffffffffffffffffffffffff')
          document.getElementById(ins[i]).attributes[2].value = wire_posX;
          document.getElementById(ins[i]).attributes[3].value = wire_posY;
        }
      }

      if (outs.length > 0) {
        for (var i = 0; i < outs.length; i++) {
          document.getElementById(outs[i]).attributes[4].value = wire_posX;
          document.getElementById(outs[i]).attributes[5].value = wire_posY;
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // MOVE HIDDEN FOLDER
  if (newFolderPhase === 'on') {
    let hidden_folder = document.getElementById('hidden_folder');
    hidden_folder.style.left = (globalX + hiddenFolderOffsetX) + 'px';   /////////////////////////////////////////////////////////////////////////////////////////////////////
    hidden_folder.style.top = (globalY + hiddenFolderOffsetY) + 'px';//////////////////////////////////////////////////////////////////////////////////////////////////////
    // console.log('moving hidden folder');
  }

  ////////////////////////////////////////////////////////////////////////////////
  // MOVE ACTUAL FOLDER
  if (folderIsMoving === true) {

    placedFolderX = (globalX - movingFolderOffsetX);   /////////////////////////////////////////////////////////////////////////////////////
    placedFolderY = (globalY - movingFolderOffsetY);
    let movingFolder = document.getElementById(movingFolderId);
    movingFolder.style.left = placedFolderX.toString() + 'px';
    movingFolder.style.top = placedFolderY.toString() + 'px';
    // console.log('moving a folder: ' + movingFolderId);

    //////////////////////////////////////////////////////////////////////////////////////////
    ////  MOVING WIRES
    /// only outs are moving for now...

    if (wiresOfNodes[movingFolderId]) {

      move_dataX_var = globalX;
      move_dataY_var = globalY;

      let ins = wiresOfNodes[movingFolderId].ins;
      let outs = wiresOfNodes[movingFolderId].outs;

      if (outs.length > 0) {
        for (var i = 0; i < outs.length; i++) {
          move_node_offsetX = globalX - movingFolder.offsetLeft;
          move_node_offsetY = globalY - movingFolder.offsetTop;

          globalWirePosX = (move_dataX_var - move_node_offsetX + nodeWidthOffset).toString() + 'px';
          globalWirePosY = (move_dataY_var - move_node_offsetY + nodeHeightOffset).toString() + 'px';


          document.getElementById(outs[i]).attributes[4].value = globalWirePosX;
          document.getElementById(outs[i]).attributes[5].value = globalWirePosY;
        }
      }

      if (ins.length > 0) {
        for (var i = 0; i < ins.length; i++) {
          move_node_offsetX = globalX - movingFolder.offsetLeft;
          move_node_offsetY = globalY - movingFolder.offsetTop;

          globalWirePosX = (move_dataX_var - move_node_offsetX + nodeWidthOffset).toString() + 'px';
          globalWirePosY = (move_dataY_var - move_node_offsetY + nodeHeightOffset).toString() + 'px';

          document.getElementById(ins[i]).attributes[2].value = globalWirePosX;
          document.getElementById(ins[i]).attributes[3].value = globalWirePosY;
        }
      }
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// global scroll x and y
let has_scrolledX = false;
let has_scrolledY = false;

let global_scrollX = '';
let global_scrollY = '';

/////// detect scroll offset, modify arrays
window.onscroll = function(event) {
  global_scrollX = window.scrollX;
  global_scrollY = window.scrollY;

  document.getElementById('hidden_scrollX_node').value = (global_scrollX || 0).toString();
  document.getElementById('hidden_scrollY_node').value = (global_scrollY || 0).toString();
  document.getElementById('hidden_scrollX_folder').value = (global_scrollX || 0).toString();
  document.getElementById('hidden_scrollY_folder').value = (global_scrollY || 0).toString();

  // update global_scroll variables if node is moving
  if (node_is_moving === true) {
    // update arrays
    global_scrollX += globalX;
    move_dataX_var = global_scrollX;

    global_scrollY += globalY;
    move_dataY_var = global_scrollY;

    // console.log('node ' + move_node_id + ' is moving, x: ' + move_dataX_var + ' y: ' + move_dataY_var);
    ////////////////////////////////////////////////////////////////////////////////////////
    // move the node
    let move_node = document.getElementById(move_node_id);
    // console.log('why nan: ' + move_node_offsetX)
    // console.log(typeof move_node_offsetX)
    move_node.style.zIndex = 3;
    move_node.style.left = (move_dataX_var - move_node_offsetX).toString() + 'px';
    move_node.style.top = (move_dataY_var - move_node_offsetY).toString() + 'px';

  }
  // console.log('scrollX ' + global_scrollX + ' scrollY: ' + global_scrollY);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// new node

let newNodePhase = 'off';
let placedX = '';
let placedY = '';

//////////////// for create node button clicks
let create_node = document.getElementById('create_node');
create_node.addEventListener('click', function(event) {
  event.stopPropagation();
  if (newNodePhase === 'off') {
    newNodePhase = 'on';
    /// display follower
    let wire_posX = (globalX - move_node_offsetX - nodeWidthOffset).toString() + 'px';
    let wire_posY = (globalY - move_node_offsetY - nodeHeightOffset).toString() + 'px';
    document.getElementById('hidden_node').style.top = wire_posY;
    document.getElementById('hidden_node').style.left = wire_posX;
    document.getElementById('hidden_node').style.visibility = 'visible';
    // console.log("new: " + newNodePhase);
  }
});

////////////// placing the node
document.addEventListener('click', function(event) {
  if (newNodePhase === 'on') {
    placedX = event.pageX;
    placedY = event.pageY;
    // console.log('x: ' + placedX + ' y: ' + placedY)
    newNodePhase = 'off';
    // console.log("new: " + newNodePhase);
    if ((placedX - 80) < 0) {
      placedX = 10;
    } else {
      placedX -= 80;
    }
    if ((placedY - 38) < 0) {
      placedY = 10;
    } else {
      placedY -= 38;
    }

    let save_new_route = '/save_new_node/' + placedX.toString() + '/' + placedY.toString() + '/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString();

    // console.log(save_new_route)

    window.location.href = save_new_route;
    // window.location.href = '/save_new_node/' + placedX + '/' + placedY;
  }

  if (newFolderPhase === 'on') {
    document.getElementById('hidden_folder').style.zIndex = '-1';

    newFolderPhase = 'off';

    placedFolderX = event.pageX + hiddenFolderOffsetX;
    placedFolderY = event.pageY + hiddenFolderOffsetY;
    // console.log(event.pageX)
    window.location.href = '/save_new_folder/' + placedFolderX + '/' + placedFolderY + '/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString();  ///////////////////////////////////////////////////////////
    // document.getElementById('hidden_folder').style.visibility = 'hidden';
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// move node

////////// use in global pos listener in an if
let node_is_moving = false;

let move_dataX = [];
let move_dataY = [];

let move_dataX_var = '';
let move_dataY_var = '';

let move_node_id = '';
// let move_node = '';
let move_node_offsetX = 0;
let move_node_offsetY = 0;

///////// node move mouseup
function node_move_mouseup() {
  /// get coords as final node pos, send to python
  // console.log(move_node_id + ' mouseup, x: ' + move_dataX_var + ' y: ' + move_dataY_var);
  node_is_moving = false;
  // purge listener and move_data arrays
  document.removeEventListener('mouseup', node_move_mouseup);
  let move_node = document.getElementById(move_node_id);
  move_node.style.zIndex = 1;
  //////////////////////////////////////////////////////////////////////////////////// needs final coords

  let save_new_pos = '/save_new_pos/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString() + '/' + (move_dataX_var - move_node_offsetX).toString() + '/' + (move_dataY_var - move_node_offsetY).toString() + '/' + move_node_id;

  // console.log(save_new_pos)

  window.location.href = save_new_pos;        ////

};

////////// all node buttons
let move_buttons = document.getElementsByClassName('nodes_grabber');

/////////////////////////////////////////////////////////////////////
/////////// MOVE NODES INITIAL MOUSEDOWN
for (let i = 0; i < move_buttons.length; i++) {
  move_buttons[i].addEventListener('mousedown', function(event) {
    // event.preventDefault();
    event.stopPropagation();
    move_node_id = event.target.parentNode.parentNode.id;
    console.log('fffffffffffffffffffffffffff',move_node_id)
    let move_node = document.getElementById(move_node_id);

    // console.log(event.originalTarget.parentNode.parentNode.id)
    // stick mousedown in move_data X and Y just in case node is not moved
    // pageX and pageY arethe actual page (whether scroll or not)
    // clientX and clientY are the vieable portion... effed up

    // get inits and init offsets
    let origX = move_node.offsetLeft;
    let origY = move_node.offsetTop;
    // console.log('origX: ' + origX)
    // console.log(move_node)

    let m_downX = event.pageX;
    let m_downY = event.pageY;
    // console.log('m_downX: ' + m_downX)

    // later, we subtract the offsets out of the mouse pos
    move_node_offsetX = m_downX - origX;
    move_node_offsetY = m_downY - origY;

    move_dataX_var = m_downX;
    move_dataY_var = m_downY;

    node_is_moving = true;

    // console.log(move_node_id + ' mousedown, x: ' + m_downX + ' y: ' + m_downY)

    // add mouseup listener with removable function
    document.addEventListener('mouseup', node_move_mouseup);

  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////          WIRES           ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let output_nodeId = '';
let input_nodeId = '';

let offset_nodeX = '';
let offset_nodeY = '';

let outputIsNodeOrFolder = '';

let output_buttons = document.getElementsByClassName('nodes_output');
let input_buttons = document.getElementsByClassName('nodes_input');

///// inputs listeners
for (var i = 0; i < input_buttons.length; i++) {
  input_buttons[i].addEventListener('click', function(event) {
    if (output_nodeId !== '') {
      input_nodeId = event.target.parentNode.parentNode.id;
      if (input_nodeId !== output_nodeId) {
        // console.log(input_nodeId + ' input was clicked')

        // get out and in nodes pos each, convert to nums and factor in offsets
        // console.log(document.getElementById(output_nodeId));

        let output_wire_posX = document.getElementById(output_nodeId).style.left;
        output_wire_posX = parseFloat(output_wire_posX.slice(0, output_wire_posX.length - 2)) + 80;

        let output_wire_posY = document.getElementById(output_nodeId).style.top;
        output_wire_posY = parseFloat(output_wire_posY.slice(0, output_wire_posY.length - 2)) + 38;

        //////////////

        let input_wire_posX = document.getElementById(input_nodeId).style.left;
        input_wire_posX = parseFloat(input_wire_posX.slice(0, input_wire_posX.length - 2)) + 80;

        let input_wire_posY = document.getElementById(input_nodeId).style.top;
        input_wire_posY = parseFloat(input_wire_posY.slice(0, input_wire_posY.length - 2)) + 38;

        // all_nodes_width
        // all_nodes_height

        let save_new_wire = '/save_new_wire/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString() + '/' + output_nodeId + '/' + input_nodeId;
        save_new_wire += '/' + output_wire_posX + '/' + output_wire_posY + '/' + input_wire_posX + '/' + input_wire_posY;

        output_nodeId = '';
        input_nodeId = '';
        folderWireIsOpen = false;
        // console.log(save_new_wire)
        window.location.href = save_new_wire;
      } else {
        output_nodeId = '';
        folderWireIsOpen = false;
        output_nodeId = '';
        input_nodeId = '';
        // console.log('wire terminated')
      }
    }
    else if (folderWireIsOpen === true) {
      // console.log('connect folder to node...')   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /// get folder out id
      // console.log('folder out id: ' + folderWireOutId);
      //// get node in id
      input_nodeId = event.target.parentNode.parentNode.id;
      // console.log('node in id: ' + input_nodeId);

      /// get node/folder x/y offsets
      ///////////////////// outs are folder out
      let output_wire_posX = document.getElementById(folderWireOutId).style.left;
      output_wire_posX = parseFloat(output_wire_posX.slice(0, output_wire_posX.length - 2)) + 80;

      let output_wire_posY = document.getElementById(folderWireOutId).style.top;
      output_wire_posY = parseFloat(output_wire_posY.slice(0, output_wire_posY.length - 2)) + 38;

      ///////////////// ins are node in
      let input_wire_posX = document.getElementById(input_nodeId).style.left;
      input_wire_posX = parseFloat(input_wire_posX.slice(0, input_wire_posX.length - 2)) + 80;

      let input_wire_posY = document.getElementById(input_nodeId).style.top;
      input_wire_posY = parseFloat(input_wire_posY.slice(0, input_wire_posY.length - 2)) + 38;

      /////// update wires
      ////// {"wire1": {"toInNode": ["832.0px", "267.0px"], "toOutNode": ["579", "131"]}}
      let save_new_wire = '/save_new_wire_foldertonode/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString() + '/' + folderWireOutId + '/' + input_nodeId;
      save_new_wire += '/' + output_wire_posX + '/' + output_wire_posY + '/' + input_wire_posX + '/' + input_wire_posY;

      folderWireIsOpen = false;
      output_nodeId = '';
      input_nodeId = '';

      window.location.href = save_new_wire;
    }
  });
}

///// outputs listeners
for (let i = 0; i < output_buttons.length; i++) {
  output_buttons[i].addEventListener('click', function(event) {
    if (output_nodeId === '') {
      output_nodeId = event.target.parentNode.parentNode.id;
      // console.log(output_nodeId + ' output was clicked');
    } else {
      output_nodeId = '';
      // console.log('wire terminated');
    }

  });
}

// console.log(move_buttons[1].id)
////////////////////////////////////////////////////////////////////////////////////
// DELETE WIRES
let delete_wire_id = '';

/////////// all wires double click listener
let all_wires = document.getElementsByClassName('wires');
for (var i = 0; i < all_wires.length; i++) {
  all_wires[i].addEventListener('dblclick', function(event) {
    delete_wire_id = event.target.id;
    // console.log(delete_wire_id);
    window.location.href = '/delete_wire/' + delete_wire_id;
    //////////////////////////////////////// go to python route to delete
  });
}

///////////////////////////////////////////////////////////////////////////////
// EDIT NODE
let edit_buttons = document.getElementsByClassName('nodes_edit_button');
let editing_this_nodeId = '';
let edit_form_visible = false;

for (var i = 0; i < edit_buttons.length; i++) {
  edit_buttons[i].addEventListener('click', function(event) {
    event.stopPropagation();
    editing_this_nodeId = event.target.parentNode.parentNode.id;
    // console.log('editing: ' + editing_this_nodeId)

    /////////////////////////////////////////////////////
    // get summary, details, put them and IDS in fields (and hidden field for nodeId)

    // console.log(nodesForJs)

    //// get scroll data
    document.getElementById('hidden_scrollX_node').value = (global_scrollX || 0).toString();
    document.getElementById('hidden_scrollY_node').value = (global_scrollY || 0).toString();

    document.getElementById('details').value = nodesForJs[editing_this_nodeId].details;
    document.getElementById('summary').value = nodesForJs[editing_this_nodeId].summary;
    document.getElementById('hidden_id').value = editing_this_nodeId;

    // console.log(nodesForJs[editing_this_nodeId].details + '' + document.getElementById('summary').value)

    ///////////////////////////////////////////////////////
    // reveal the form
    document.getElementById('nodeForm').style.visibility = 'visible';

    //// note, the data for save button is submettted by html via button click, straight to python
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/// delete NODE EDIT

document.getElementById('delete_button').addEventListener('click', function(event) {
  event.stopPropagation();

  window.location.href = '/delete_button/' + editing_this_nodeId  + '/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString();
})

// ///////////////////////////////////////////////////////////////////////////////////////
// // CANCEL NODE EDIT
//
document.getElementById('cancel_button').addEventListener('click', function(event) {
  event.stopPropagation();
  document.getElementById('nodeForm').style.visibility = 'hidden';
});

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// FOLDERS
let newFolderPhase = 'off';
let placedFolderX = '';
let placedFolderY = '';
let move_folder_offsetX = 0;
let move_folder_offsetY = 0;
let folderWidthOffset = 0;
let folderHeightOffset = 0;

let hiddenFolderOffsetX = -nodeWidthOffset;
let hiddenFolderOffsetY = -nodeHeightOffset;

///////////////////////////////////////////////////////////////////////////////
//////////////// CREATE FOLDER
let create_folder = document.getElementById('create_folder');
create_folder.addEventListener('click', function(event) {
  event.stopPropagation();
  if (newFolderPhase === 'off') {
    newFolderPhase = 'on';
    /// display follower

    let hidden_folder_posX = (globalX + hiddenFolderOffsetX).toString() + 'px';
    let hidden_folder_posY = (globalY + hiddenFolderOffsetY).toString() + 'px';
    document.getElementById('hidden_folder').style.top = hidden_folder_posY;
    document.getElementById('hidden_folder').style.left = hidden_folder_posX;
    document.getElementById('hidden_folder').style.zIndex = '3';
    document.getElementById('hidden_folder').style.visibility = 'visible';
    // console.log("new: " + newNodePhase);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////
// MOVE FOLDER MOUSEDOWN
let movingFolderId = '';
let folderIsMoving = false;
let movingFolderOffsetX = 0;
let movingFolderOffsetY = 0;

let foldersGrabber = document.getElementsByClassName('folders_grabber');
for (var i = 0; i < foldersGrabber.length; i++) {
  foldersGrabber[i].addEventListener('mousedown', function(event) {
    movingFolderId = event.target.parentNode.parentNode.id;
    let theMovingFolder = document.getElementById(movingFolderId);

    theMovingFolder.style.zIndex = '3';

    ////////////// note, for some unknown reason, using globalX and globalY (mousemove) causes severe problems here
    // if the same point is mousedowned after a prior move. MUST use event. and .offsetLeft etc instead here!!!
    // get offsets

    movingFolderOffsetX = event.pageX - theMovingFolder.offsetLeft;
    movingFolderOffsetY = event.pageY - theMovingFolder.offsetTop;

    placedFolderX = event.pageX - movingFolderOffsetX;
    placedFolderY = event.pageY - movingFolderOffsetY;
    // placedFolderX = (globalX - movingFolderOffsetX);

    globalWirePosX = (event.pageX - movingFolderOffsetX + nodeWidthOffset).toString() + 'px';
    globalWirePosY = (event.pageY - movingFolderOffsetY + nodeHeightOffset).toString() + 'px'; //////////////////////////////////////////////// maybe delete

    // theMovingFolder.style.left = placedFolderX + 'px';
    // theMovingFolder.style.top = placedFolderY + 'px';

    // console.log('started moving a folder: ' + movingFolderId);
    folderIsMoving = true;
    document.addEventListener('mouseup', movingFolderMouseUp);
  });
}

/////////////////////////////////////////////////////////////////////////
// MOVE FOLDER MOUSEUP
function movingFolderMouseUp() {
  folderIsMoving = false;
  document.getElementById(movingFolderId).style.zIndex = '0';
  // console.log(movingFolderId + ' is done moving');

  let theMovingFolder = document.getElementById(movingFolderId);

  theMovingFolder.style.left = placedFolderX + 'px';
  theMovingFolder.style.top = placedFolderY + 'px';

  document.removeEventListener('mouseup', movingFolderMouseUp);
  // console.log('fffffffffffffffffffffffffffffff: has px? ' + globalWirePosY)
  window.location.href = '/folder_new_loc/' + movingFolderId + '/' + placedFolderX + '/' + placedFolderY + '/' + globalWirePosX + '/' + globalWirePosY + '/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString();

}

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// EDIT FOLDER DATA
let editingThisFolder = '';
let currentIndex = 0;
let currentGotoId = '';
let currentGotoSumm = '';
let spinnerArr = ['root'];
for (var i = 0; i < fldrsGlobalForJs['allFolders'].length; i++) {
  spinnerArr.push(fldrsGlobalForJs['allFolders'][i]);
}

////////////////// truncate text in folder selector
function truncateText(strInput, amt) {
  if (strInput.length > amt) {
    strInput = strInput.slice(0, amt) + '...';
  }
  return strInput;
}

let foldersEditButton = document.getElementsByClassName('folders_edit_button');
for (var i = 0; i < foldersEditButton.length; i++) {
  foldersEditButton[i].addEventListener('click', function(event) {
    event.stopPropagation();

    //// get scroll data
    document.getElementById('hidden_scrollX_folder').value = (global_scrollX || 0).toString();
    document.getElementById('hidden_scrollY_folder').value = (global_scrollY || 0).toString();

    editingThisFolder = event.target.parentNode.parentNode.id;
    // console.log('editing this folder: ' + editingThisFolder);

    document.getElementById('hidden_id_folder').value = editingThisFolder;
    // console.log("did it make it in? " + document.getElementById('hidden_id_folder').value);

    /////////////// put folder summary in text box
    document.getElementById('folderTitle').value = fldrsGlobalForJs['summaries'][editingThisFolder];
    // document.getElementById('folderTitle').innerText = fldrsGlobalForJs['summaries'][fldrsGlobalForJs['gotos'][editingThisFolder]]

    /////////////// put default route in hidden goto field
    // console.log('what is it: ' +fldrsGlobalForJs['parents'][editingThisFolder] + ' ' + editingThisFolder )
    document.getElementById('hiddenFolderSelection').value = fldrsGlobalForJs['gotos'][editingThisFolder];

    currentGotoId = fldrsGlobalForJs['gotos'][editingThisFolder];
    currentIndex = spinnerArr.indexOf(currentGotoId);
    currentGotoSumm = fldrsGlobalForJs['summaries'][currentGotoId];

    document.getElementById('folderSelectorDisplay').innerText = truncateText(currentGotoSumm, 50);

    // console.log('spinner arr: ' + fldrsGlobalForJs['allFolders'] + ' | current index ' + currentIndex)
    // console.log('currentGotoID: ' + currentGotoId)
    // console.log('currentGotoSumm: ' + currentGotoSumm)

    document.getElementById('folder_edit_page').style.visibility = 'visible';
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// spinner up button
// let spinnerArr = fldrsGlobalForJs['allFolders'];

/////// spinner arr is children, find the index of folder we are currently editing

function resetGotoInfo() {
  currentGotoId = spinnerArr[currentIndex];
  currentGotoSumm = fldrsGlobalForJs['summaries'][currentGotoId];

  document.getElementById('hiddenFolderSelection').value = currentGotoId;
  document.getElementById('folderSelectorDisplay').innerText = truncateText(currentGotoSumm, 50);
}

// console.log('spinnerArr: ' + fldrsGlobalForJs['allFolders'])

document.getElementById('folderSelectorUpArrow').addEventListener('click', function() {
  // console.log('up arrow clicked')
  currentIndex++;
  if (currentIndex === spinnerArr.length) {
    currentIndex = 0;
  }
  // console.log('current index: ' + currentIndex)
  resetGotoInfo();
  // console.log("current goto id: "+currentGotoId);
  // console.log("currentgoto sum: "+currentGotoSumm);
  // console.log('spinner arr: ' + fldrsGlobalForJs['allFolders'] + ' | current index ' + currentIndex)
  // console.log('currentGotoID: ' + currentGotoId)
  // console.log('currentGotoSumm: '+currentGotoSumm)
});

document.getElementById('folderSelectorDownArrow').addEventListener('click', function() {
  // console.log('down arrow clicked')
  currentIndex--;
  if (currentIndex === -1) {
    currentIndex = spinnerArr.length - 1;
  }
  // console.log('current index: ' + currentIndex)
  resetGotoInfo();
  // console.log("current goto id: "+currentGotoId);
  // console.log("currentgoto sum: "+currentGotoSumm);
  // console.log('spinner arr: ' + fldrsGlobalForJs['allFolders'] + ' | current index ' + currentIndex)
  // console.log('currentGotoID: ' + currentGotoId)
  // console.log('currentGotoSumm: '+currentGotoSumm)
});


/////////////////////////////////////////////////
///////////////// spinner down button

////////////////////////////////////////////////////////////////////////////
/////////////////////// CANCEL FOLDER EDIT
document.getElementById('cancelFolderData').addEventListener('click', function() {
  document.getElementById('folder_edit_page').style.visibility = 'hidden';
});

//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// DELETE FOLDER
document.getElementById('deleteFolderData').addEventListener('click', function(event) {
  // console.log('going to delete: ' + editingThisFolder);
  window.location.href = '/delete_folder/' + editingThisFolder + '/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString();
});

////////////////////////////////////////////////////////////////////////////////////////////////
// SWITCH FOLDER BUTTON
let folder_switch_buttons = document.getElementsByClassName('folders_label');
if (folder_switch_buttons !== null) {
  for (var i = 0; i < folder_switch_buttons.length; i++) {
    folder_switch_buttons[i].addEventListener('click', function(event) {
      let folderId = event.target.parentNode.id;
      // console.log('folderId: ' + folderId)
      window.location.href = '/switch_folder/' + fldrsGlobalForJs['gotos'][folderId];
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
// GOTO PARENT
let goToParent = document.getElementById('goToParent');
if (goToParent !== null) {
  goToParent.addEventListener('click', function(event) {
    let currentFolder = document.getElementById('current_folder').classList[0];
    // console.log(currentFolder)
    if (currentFolder !== 'root') {
      // console.log('/goto_parent/' + currentFolder);
      window.location.href = '/goto_parent/' + currentFolder;
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////////
///////// CREATE FOLDER WIRE
let folderWireIsOpen = false;
let folderWireInId = '';
let folderWireOutId = '';

let folderInputs = document.getElementsByClassName('folders_input');
let folderOutputs = document.getElementsByClassName('folders_output');

for (var i = 0; i < folderInputs.length; i++) {
  folderOutputs[i].addEventListener('click', function(event) {
    if (folderWireIsOpen === false) {
      folderWireIsOpen = true;
      folderWireOutId = event.target.parentNode.parentNode.id;
      // console.log(folderWireOutId + ' output has been clicked')
    } else {
      folderWireIsOpen = false;
      output_nodeId = '';
      input_nodeId = '';
      // console.log('folder wire operateion has been canceled')
    }
  });

  folderInputs[i].addEventListener('click', function(event) {
    folderWireInId = event.target.parentNode.parentNode.id;
    if (folderWireIsOpen === true && folderWireOutId !== folderWireInId) {
      // console.log(folderWireInId + ' input has been clicked, folder to folder wire created')   ///////////////////////////////////////////////////////////////////

      /// get folder out id
      // console.log('folder out id: ' + folderWireOutId);
      //// get node in id
      // input_nodeId = event.originalTarget.parentNode.parentNode.id;
      // console.log('folder in id: ' + folderWireInId);

      /// get node/folder x/y offsets
      ///////////////////// outs are folder out
      let output_wire_posX = document.getElementById(folderWireOutId).style.left;
      output_wire_posX = parseFloat(output_wire_posX.slice(0, output_wire_posX.length - 2)) + 80;

      let output_wire_posY = document.getElementById(folderWireOutId).style.top;
      output_wire_posY = parseFloat(output_wire_posY.slice(0, output_wire_posY.length - 2)) + 38;

      ///////////////// ins are folder in
      let input_wire_posX = document.getElementById(folderWireInId).style.left;
      input_wire_posX = parseFloat(input_wire_posX.slice(0, input_wire_posX.length - 2)) + 80;

      let input_wire_posY = document.getElementById(folderWireInId).style.top;
      input_wire_posY = parseFloat(input_wire_posY.slice(0, input_wire_posY.length - 2)) + 38;
      //
      // /////// update wires
      // ////// {"wire1": {"toInNode": ["832.0px", "267.0px"], "toOutNode": ["579", "131"]}}
      let save_new_wire = '/save_new_wire_foldertofolder/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString() + '/' + folderWireOutId + '/' + folderWireInId;
      save_new_wire += '/' + output_wire_posX + '/' + output_wire_posY + '/' + input_wire_posX + '/' + input_wire_posY;

      folderWireIsOpen = false;
      output_nodeId = '';
      input_nodeId = '';

      window.location.href = save_new_wire;
    }
    else if (output_nodeId !== '') {
      // console.log('connecting node output to folder input...')    //////////////////////////////////////////////////////////////////////////////////////////
      // output_nodeId
      // folderWireInId

      /// get node/folder x/y offsets
      ///////////////////// outs are node out
      let output_wire_posX = document.getElementById(output_nodeId).style.left;
      output_wire_posX = parseFloat(output_wire_posX.slice(0, output_wire_posX.length - 2)) + 80;

      let output_wire_posY = document.getElementById(output_nodeId).style.top;
      output_wire_posY = parseFloat(output_wire_posY.slice(0, output_wire_posY.length - 2)) + 38;

      ///////////////// ins are folder in
      let input_wire_posX = document.getElementById(folderWireInId).style.left;
      input_wire_posX = parseFloat(input_wire_posX.slice(0, input_wire_posX.length - 2)) + 80;

      let input_wire_posY = document.getElementById(folderWireInId).style.top;
      input_wire_posY = parseFloat(input_wire_posY.slice(0, input_wire_posY.length - 2)) + 38;

      let save_new_wire = '/save_new_wire_nodetofolder/' + (global_scrollX || 0).toString() + '/' + (global_scrollY || 0).toString() + '/' + output_nodeId + '/' + folderWireInId;
      save_new_wire += '/' + output_wire_posX + '/' + output_wire_posY + '/' + input_wire_posX + '/' + input_wire_posY;

      folderWireIsOpen = false;
      output_nodeId = '';
      input_nodeId = '';

      window.location.href = save_new_wire;
    }
    else {
      folderWireIsOpen = false;
      output_nodeId = '';
      input_nodeId = '';
      // console.log('folder wire operateion has been canceled')
    }
  });
}

////////
