from flask import Flask, render_template, url_for, request, redirect
# from node_form import Node_Form
import pprint
pp = pprint.PrettyPrinter(indent=4)
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'notsecretkey'

class Data():
    def __init__(self):
        self.currentFolder = 'root'
        self.nodes = self.getNodesJson()
        self.wires = self.getWiresJson()
        self.fldrs = self.getFldrsJson()
        self.fldrsGlobal = self.getFldrsGlobalJson()
        self.scrollX = ''
        self.scrollY = ''
        self.nodeWidthOffset = 80
        self.nodeHeightOffset = 38
        # for switching windows of nodes


    def getNodesJson(self):
        try:
            with open('nodes' + self.currentFolder + '.json', 'rb') as file:
                return json.load(file)
        except:
            return {}


    def getWiresJson(self):
        try:
            with open('wires' + self.currentFolder + '.json', 'rb') as file:
                return json.load(file)
        except:
            return {}


    def getFldrsJson(self):
        try:
            with open('fldrs' + self.currentFolder + '.json', 'rb') as file:
                return json.load(file)
        except:
            return {}


    def getFldrsGlobalJson(self):
        try:
            with open('fldrsGlobal.json', 'rb') as file:
                return json.load(file)
        except:
            return {'allFolders': [], 'parents': {}, 'summaries': {'root': 'Root'}, 'gotos': {'root': 'root'}}  # going into 'parents' reveals: keys are children, values are each of their parents


    def saveBothJson(self):
        with open('nodes' + self.currentFolder + '.json', 'w') as file:
            json.dump(self.nodes, file)
        with open('wires' + self.currentFolder + '.json', 'w') as file:
            json.dump(self.wires, file)
        with open('fldrs' + self.currentFolder + '.json', 'w') as file:
            json.dump(self.fldrs, file)
        with open('fldrsGlobal.json', 'w') as file:
            json.dump(self.fldrsGlobal, file)


    def saveJsJson(self, dataDict, jsArrName, fileName):
        """ fileName must have have '.js' at end
        """
        with open(fileName, 'w') as file:
            file.write('let ' + jsArrName + ' = ' + '')

            json.dump(dataDict, file)

        with open(fileName, 'a') as file:
            file.write(';')


    def getCssfromDb(self, nodeId):
        """ gets css string from db
        """
        return self.nodes[nodeId]['loc']


    def getNewId(self, nodeFolderOrWire):
        """ gets new wire id, use in routes prior to adding new wires
            nodeFolderOrWire is 'node' or 'wire' or 'fldr'
        """

        # differentiate for node and wire getting
        if nodeFolderOrWire == 'node':
            dataset = self.nodes
            label = 'node'
        elif nodeFolderOrWire == 'wire':
            dataset = self.wires
            label = 'wire'
        elif nodeFolderOrWire == 'fldr':
            dataset = self.fldrsGlobal['allFolders']
            label = 'fldr'

        # if there is nothing int he dataset
        if len(dataset) == 0:
            return label + str(1)
        else:
            # get all previously made nums, put in temp list
            temp = []
            for key in dataset:
                key = int(key[4:])
                if key not in temp:
                    temp.append(key)
            # sort for later
            temp.sort()
            # if first num is > 1, go 1 smaller
            if temp[0] > 1:
                return label + str(temp[0] - 1)
            if len(temp) == 1:
                return label + str(temp[0] + 1)

            for i, num in enumerate(temp):
                if i > 0:
                    if (num - temp[i-1]) > 1:
                        return label + str(temp[i-1] + 1)
                else:
                    return label + str(max(temp) + 1)


    def getWiresOfNodes(self):
        # get node ids that have wires
        temp = {}
        for nodeId in self.nodes:
            if len(self.nodes[nodeId]['wires']['ins']) > 0 or len(self.nodes[nodeId]['wires']['outs']) > 0:
                ins = self.nodes[nodeId]['wires']['ins']
                outs = self.nodes[nodeId]['wires']['outs']
                temp[nodeId] = {'ins': ins, 'outs': outs}

        #################################################################################################################################################
        for fldrId in self.fldrs:
            if len(self.fldrs[fldrId]['wires']['outs']) > 0 or len(self.fldrs[fldrId]['wires']['ins']) > 0:
                ins = self.fldrs[fldrId]['wires']['ins']
                outs = self.fldrs[fldrId]['wires']['outs']
                temp[fldrId] = {'ins': ins, 'outs': outs}

        return temp


    def getWiresOfNodeThatMoved(self, nodeId):
        # get node ids that have wires
        ins = self.nodes[nodeId]['wires']['ins']
        outs = self.nodes[nodeId]['wires']['outs']

        return {'ins': ins, 'outs': outs}


    def makeDictForJS(self, aDict, jsFilename, jsObjName):
        """ make a dict for js reading of data
            pass a dict, then it's filename as 'filename.js'
        """
        with open(jsFilename, 'w') as file:
            file.write('let ' + jsObjName + ' = ')
            json.dump(aDict, file)
            file.write(';')


    def updateWiresPos(self, nodeId, new_posX, new_posY):
        """ update only one node's connected wires
        ################ this updates db only
        """

        wireUpdates = self.getWiresOfNodeThatMoved(nodeId)

        # new pos of node with offsets factored
        new_posX = str(float(new_posX )+ self.nodeWidthOffset) + 'px'
        new_posY = str(float(new_posY) + self.nodeHeightOffset) + 'px'
        # print('news: ' + newX + ' ' + newY)

        for wireId in wireUpdates['outs']:
            self.wires[wireId]['toOutNode'] = [new_posX, new_posY]

        for wireId in wireUpdates['ins']:
            self.wires[wireId]['toInNode'] = [new_posX, new_posY]


data = Data()
# print(data.nodes)


@app.route('/', methods=['GET', 'POST'])
def index():
    # just in case nothing is there:
    try:
        with open('static/wiresOfNodes.js', 'r') as file:
            pass
    except:
        with open('static/wiresOfNodes.js', 'w') as file:
            file.write('let wiresOfNodes = {}')

    ######### save out wires db for js
    dicti = data.getWiresOfNodes()
    data.makeDictForJS(dicti, 'static/wiresOfNodes.js', 'wiresOfNodes')

    ############### for passing summary and details data later on
    data.makeDictForJS(data.nodes, 'static/nodesForJs.js', 'nodesForJs')
    data.makeDictForJS(data.fldrs, 'static/fldrsForJs.js', 'fldrsForJs')
    data.makeDictForJS(data.fldrsGlobal, 'static/fldrsGlobalForJs.js', 'fldrsGlobalForJs')
    # {"allFolders": ["fldr1", "fldr2"], "parents": {"fldr1": "root", "fldr2": "fldr1"}}
    if data.currentFolder != 'root':
        if data.currentFolder in data.fldrsGlobal['parents']:
            parent = data.fldrsGlobal['parents'][data.currentFolder]
        else:
            parent = ''
    else:
        parent = ''

    gotoDisplay = data.fldrsGlobal['gotos']
    # print(gotoDisplay)
    gotoSummaries = data.fldrsGlobal['summaries']

    return render_template('index.html', nodes=data.nodes, wires=data.wires, gotoDisplay=gotoDisplay, folders=data.fldrs, scrollX=data.scrollX, scrollY=data.scrollY, currentFolder=data.currentFolder, parent=parent)


@app.route('/save_new_node/<string:placedX>/<string:placedY>/<string:global_scrollX>/<string:global_scrollY>')
def save_new_node(placedX, placedY, global_scrollX, global_scrollY):

    location = 'position: absolute; top: ' + placedY + 'px; left: ' + placedX + 'px;'

    nodeId = data.getNewId('node')

    # ######### save out wires db for js
    data.scrollX = global_scrollX;
    data.scrollY = global_scrollY;

    data.nodes[nodeId] = {'loc': location}  # = {'summary': summary, 'details': details, 'nodeId': nodeId, 'locLeft': locLeft, 'locTop': locTop}
    data.nodes[nodeId]['wires'] = {'ins': [], 'outs': []}
    data.nodes[nodeId]['posX'] = placedX
    data.nodes[nodeId]['posY'] = placedY
    data.nodes[nodeId]['summary'] = ''
    data.nodes[nodeId]['details'] = ''

    # for passing summary and details data later on
    data.makeDictForJS(data.nodes, 'static/nodesForJs.js', 'nodesForJs')

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')

@app.route('/save_new_pos/<string:global_scrollX>/<string:global_scrollY>/<string:new_posX>/<string:new_posY>/<string:nodeId>')
def save_new_pos(global_scrollX, global_scrollY, new_posX, new_posY, nodeId):

    location = 'position: absolute; top: ' + new_posY + 'px; left: ' + new_posX + 'px;'

    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    ########## update db with new positions
    data.updateWiresPos(nodeId, new_posX, new_posY)

    ######### save out wires db for js
    data.nodes[nodeId]['loc'] = location  # = {'summary': summary, 'details': details, 'nodeId': nodeId, 'locLeft': locLeft, 'locTop': locTop}
    data.nodes[nodeId]['posX'] = new_posX
    data.nodes[nodeId]['posY'] = new_posY
    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_new_wire/<string:global_scrollX>/<string:global_scrollY>/<string:output_nodeId>/<string:input_nodeId>/<string:output_wire_posX>/<string:output_wire_posY>/<string:input_wire_posX>/<string:input_wire_posY>')
def save_new_wire(global_scrollX, global_scrollY, output_nodeId, input_nodeId, output_wire_posX, output_wire_posY, input_wire_posX, input_wire_posY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    ###### get new wire id
    wireId = data.getNewId('wire')

    ######### save out wires db for js
    # append in ids and coords (only needed for when a node with wires is moved)
    data.nodes[output_nodeId]['wires']['outs'].append(wireId)
    data.nodes[input_nodeId]['wires']['ins'].append(wireId)
    # create wire           #        [x, y]           [x, y]
    data.wires[wireId] = {'toInNode': [input_wire_posX, input_wire_posY], 'toOutNode': [output_wire_posX, output_wire_posY]}

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_new_wire_foldertonode/<string:global_scrollX>/<string:global_scrollY>/<string:output_folderId>/<string:input_nodeId>/<string:output_wire_posX>/<string:output_wire_posY>/<string:input_wire_posX>/<string:input_wire_posY>')
def save_new_wire_foldertonode(global_scrollX, global_scrollY, output_folderId, input_nodeId, output_wire_posX, output_wire_posY, input_wire_posX, input_wire_posY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    wireId = data.getNewId('wire')
    # print('new wire: ',wireId)

    ######### save out wires db for js
    data.fldrs[output_folderId]['wires']['outs'].append(wireId)
    data.nodes[input_nodeId]['wires']['ins'].append(wireId)

    data.wires[wireId] = {'toInNode': [input_wire_posX, input_wire_posY], 'toOutNode': [output_wire_posX, output_wire_posY]}

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_new_wire_nodetofolder/<string:global_scrollX>/<string:global_scrollY>/<string:output_nodeId>/<string:input_folderId>/<string:output_wire_posX>/<string:output_wire_posY>/<string:input_wire_posX>/<string:input_wire_posY>')
def save_new_wire_nodetofolder(global_scrollX, global_scrollY, output_nodeId, input_folderId, output_wire_posX, output_wire_posY, input_wire_posX, input_wire_posY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    wireId = data.getNewId('wire')
    # print('new wire: ',wireId)

    ######### save out wires db for js
    data.fldrs[input_folderId]['wires']['ins'].append(wireId)
    data.nodes[output_nodeId]['wires']['outs'].append(wireId)

    data.wires[wireId] = {'toInNode': [input_wire_posX, input_wire_posY], 'toOutNode': [output_wire_posX, output_wire_posY]}

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/delete_wire/<string:delete_wire_id>')
def delete_wire(delete_wire_id):
    data.wires.pop(delete_wire_id)
    for nodeId in data.nodes:
        if delete_wire_id in data.nodes[nodeId]['wires']['ins']:
            data.nodes[nodeId]['wires']['ins'].remove(delete_wire_id)

        if delete_wire_id in data.nodes[nodeId]['wires']['outs']:
            data.nodes[nodeId]['wires']['outs'].remove(delete_wire_id)

    for folderId in data.fldrs:
        if delete_wire_id in data.fldrs[folderId]['wires']['ins']:
            data.fldrs[folderId]['wires']['ins'].remove(delete_wire_id)
        if delete_wire_id in data.fldrs[folderId]['wires']['outs']:
            data.fldrs[folderId]['wires']['outs'].remove(delete_wire_id)

    ######### save out wires db for js
    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_button', methods=['GET', 'POST'])
def save_button():
    # print('save got the ' + nodeId)
    # get data from the request, html button click
    summary = request.form['summary']
    details = request.form['details']
    id = request.form['hidden_id']

    data.scrollX = request.form['hidden_scrollX_node']
    data.scrollY = request.form['hidden_scrollY_node']

    # print('form id: ',id,summary,details)

    data.nodes[id]['summary'] = summary
    data.nodes[id]['details'] = details

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/delete_button/<string:nodeId>/<string:global_scrollX>/<string:global_scrollY>', methods=['GET', 'POST'])
def delete_button(nodeId, global_scrollX, global_scrollY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY
    # get wires too...
    wiresIns = data.nodes[nodeId]['wires']['ins']
    wiresOuts = data.nodes[nodeId]['wires']['outs']

    # remove wires
    for delete_wire_id in wiresIns:
        data.wires.pop(delete_wire_id)

    for delete_wire_id in wiresOuts:
        data.wires.pop(delete_wire_id)

    # delete node
    data.nodes.pop(nodeId)

    # combine ins and outs because who knows...
    combined = []
    for item in wiresIns:
        combined.append(item)
    for item in wiresOuts:
        combined.append(item)

    # print('combined:',combined)

    # delete wires in other nodes:
    for wireId in wiresIns:
        for nodeId in data.nodes:
            if wireId in data.nodes[nodeId]['wires']['outs']:
                data.nodes[nodeId]['wires']['outs'].remove(wireId)

    for wireId in wiresOuts:
        for nodeId in data.nodes:
            if wireId in data.nodes[nodeId]['wires']['ins']:
                data.nodes[nodeId]['wires']['ins'].remove(wireId)

    # if folders exist, delete wire refs
    if len(data.fldrs) > 0:
        for fldrId in data.fldrs:
            for outs in wiresOuts:
                if outs in data.fldrs[fldrId]['wires']['ins']:
                    data.fldrs[fldrId]['wires']['ins'].remove(outs)
            for ins in wiresIns:
                if ins in data.fldrs[fldrId]['wires']['outs']:
                    data.fldrs[fldrId]['wires']['outs'].remove(ins)

    ############### for passing summary and details data later on
    data.makeDictForJS(data.nodes, 'static/nodesForJs.js', 'nodesForJs')

    ######### save out wires db for js
    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_new_folder/<string:posX>/<string:posY>/<string:global_scrollX>/<string:global_scrollY>', methods=['GET', 'POST'])
def save_new_folder(posX, posY, global_scrollX, global_scrollY):
    folderId = data.getNewId('fldr')
    # print(folderId)

    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    data.fldrs[folderId] = {}
    data.fldrs[folderId]['loc'] = 'position: absolute; top: ' + posY + 'px; left: ' + posX + 'px;'
    data.fldrs[folderId]['label'] = 'Folder ' + folderId[4:]
    data.fldrs[folderId]['parent'] = data.currentFolder
    data.fldrs[folderId]['wires'] = {'ins': [], 'outs': []}
    data.fldrs[folderId]['summary'] = ""

    data.fldrsGlobal['allFolders'].append(folderId)
    data.fldrsGlobal['parents'][folderId] = data.currentFolder
    data.fldrsGlobal['summaries'][folderId] = ""
    data.fldrsGlobal['gotos'][folderId] = folderId

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/save_new_wire_foldertofolder/<string:global_scrollX>/<string:global_scrollY>/<string:output_folderId>/<string:input_folderId>/<string:output_wire_posX>/<string:output_wire_posY>/<string:input_wire_posX>/<string:input_wire_posY>')
def save_new_wire_foldertofolder(global_scrollX, global_scrollY, output_folderId, input_folderId, output_wire_posX, output_wire_posY, input_wire_posX, input_wire_posY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    wireId = data.getNewId('wire')
    # print('new wire: ',wireId)

    ######### save out wires db for js
    data.fldrs[output_folderId]['wires']['outs'].append(wireId)

    data.fldrs[input_folderId]['wires']['ins'].append(wireId)

    data.wires[wireId] = {'toInNode': [input_wire_posX, input_wire_posY], 'toOutNode': [output_wire_posX, output_wire_posY]}

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/folder_new_loc/<string:folderId>/<string:posX>/<string:posY>/<string:wirePosX>/<string:wirePosY>/<string:global_scrollX>/<string:global_scrollY>')
def folder_new_loc(folderId, posX, posY, wirePosX, wirePosY, global_scrollX, global_scrollY):

    print()
    pp.pprint('current data.fldrs: ' + str(data.fldrs))
    print()

    data.fldrs[folderId]['loc'] = 'position: absolute; top: ' + posY + 'px; left: ' + posX + 'px;'

    data.scrollX = global_scrollX
    data.scrollY = global_scrollY

    # get all wire Id attached to this folder...
    tempIns = []
    tempOuts = []
    inExists = False
    outExists = False
    if len(data.fldrs[folderId]['wires']['ins']) > 0:
        inExists = True
        for ins in data.fldrs[folderId]['wires']['ins']:
            tempIns.append(ins)
    if len(data.fldrs[folderId]['wires']['outs']) > 0:
        outExists = True
        for outs in data.fldrs[folderId]['wires']['outs']:
            tempOuts.append(outs)

    if inExists:
        for wireId in tempIns:
            data.wires[wireId]['toInNode'] = [wirePosX, wirePosY]

    if outExists:
        for wireId in tempOuts:
            data.wires[wireId]['toOutNode'] = [wirePosX, wirePosY]

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/switch_folder/<string:folderId>')
def switch_folder(folderId):
    # ?
    data.currentFolder = folderId
    # print()
    # print(folderId)
    # print()

    data.fldrs = data.getFldrsJson()
    data.nodes = data.getNodesJson()
    data.wires = data.getWiresJson()

    data.saveBothJson()

    return redirect('/')


@app.route('/goto_parent/<string:folderId>')
def goto_parent(folderId):
    # ?
    # print(data.fldrsGlobal['parents'][folderId])
    gotoFolder = data.fldrsGlobal['parents'][folderId]
    data.currentFolder = gotoFolder
    # print()
    # print('started at: ' + folderId)
    # print('going to: ' + gotoFolder)
    # print()

    data.fldrs = data.getFldrsJson()
    data.nodes = data.getNodesJson()
    data.wires = data.getWiresJson()

    data.saveBothJson()

    return redirect('/')


@app.route('/save_folder_data', methods=['GET', 'POST'])
def save_folder_data():
    summary = request.form['folderTitle']
    folderId = request.form['hidden_id_folder']   ######################################
    gotoId = request.form['hiddenFolderSelection']

    # scrollX = request.form['hidden_scrollX_folder']
    # scrollY = request.form['hidden_scrollY_folder']

    data.scrollX = request.form['hidden_scrollX_folder']
    data.scrollY = request.form['hidden_scrollY_folder']
    # print('scrooool: ',scrollY)

    # print('did it work: linking to: ',linkRoute)

    data.fldrs[folderId]['summary'] = summary
    data.fldrsGlobal['summaries'][folderId] = summary
    data.fldrsGlobal['gotos'][folderId] = gotoId

    # for item in request.form:
    #     print(item)

    data.saveBothJson()
    # return redirect('/')
    return redirect('/')


@app.route('/delete_folder/<string:folderId>/<string:global_scrollX>/<string:global_scrollY>')
def delete_folder(folderId, global_scrollX, global_scrollY):
    data.scrollX = global_scrollX
    data.scrollY = global_scrollY
    # print()
    # print("deleting this folder: ",folderId)
    # print()
    # check if it has child folder
    can_delete_flag = True
    # print(data.fldrsGlobal)
    for parent in data.fldrsGlobal['parents']:
        if data.fldrsGlobal['parents'][parent] == folderId:
            can_delete_flag = False
            # print('cant delete: ',folderId)

    if can_delete_flag == True:
        if os.path.exists('fldrs' + folderId + '.json'):
            os.remove('fldrs' + folderId + '.json')

        if os.path.exists('nodes' + folderId + '.json'):
            os.remove('nodes' + folderId + '.json')

        if os.path.exists('wires' + folderId + '.json'):
            os.remove('wires' + folderId + '.json')

        # delete associated wires:
        tempIns = []
        tempOuts = []
        inExists = False
        outExists = False
        if len(data.fldrs[folderId]['wires']['ins']) > 0:
            inExists = True
            for ins in data.fldrs[folderId]['wires']['ins']:
                tempIns.append(ins)
            # data.fldrs[folderId]['wires']['ins'] = []

        if len(data.fldrs[folderId]['wires']['outs']) > 0:
            outExists = True
            for outs in data.fldrs[folderId]['wires']['outs']:
                tempOuts.append(outs)
            # data.fldrs[folderId]['wires']['outs'] = []

        # combine for folder to folder deletions
        combined = []
        for item in tempIns:
            combined.append(item)
        for item in tempOuts:
            combined.append(item)

        # take the lists, clean out the nodes
        if len(data.nodes) > 0:
            for nodeId in data.nodes:
                for ins in tempOuts:
                    if ins in data.nodes[nodeId]['wires']['ins']:
                        data.nodes[nodeId]['wires']['ins'].remove(ins)
                for outs in tempIns:
                    if outs in data.nodes[nodeId]['wires']['outs']:
                        data.nodes[nodeId]['wires']['outs'].remove(outs)

        if len(data.fldrs) > 0:
            for folderIdddd in data.fldrs:
                for wire in combined:
                    if wire in data.fldrs[folderIdddd]['wires']['ins']:
                        data.fldrs[folderIdddd]['wires']['ins'].remove(wire)
                    if wire in data.fldrs[folderIdddd]['wires']['outs']:
                        data.fldrs[folderIdddd]['wires']['outs'].remove(wire)

        # remove from self.wires:
        for wireId in tempOuts:
            data.wires.pop(wireId)
        for wireId in tempIns:
            data.wires.pop(wireId)

        # clean gotos
        for key in data.fldrsGlobal['gotos']:
            if data.fldrsGlobal['gotos'][key] == folderId:
                data.fldrsGlobal['gotos'][key] = key
        data.fldrsGlobal['gotos'].pop(folderId)

        # clean up global and folders
        data.fldrsGlobal['allFolders'].remove(folderId)
        data.fldrsGlobal['parents'].pop(folderId)

        # clean summaries
        for key in data.fldrsGlobal['summaries']:
            if data.fldrsGlobal['summaries'][key] == folderId:
                data.fldrsGlobal['summaries'][key] = key
        data.fldrsGlobal['summaries'].pop(folderId)

        data.fldrs.pop(folderId)

    data.saveBothJson()

    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
