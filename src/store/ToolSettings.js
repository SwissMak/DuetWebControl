'use strict'

const MaxToolNumber_Turret = 16;
//const MaxToolNumber_Milling = 16;
export default {
    namespaced: true,
	state: {   
        Tools_turrent : [
            {
                oid : 0,
                name : "tool_1",
                Length : 0,
                Diameter : 0,
                TipRadius : 0,
                XOffset : 0,
                ZOffset : 0,
                toolKind: "Turret",
                tooltype : "Radial",
                IMG : "iconholderdrill.jpg",
            },
        ],
        toolKinds : [
            "Turret","Milling"
        ],
        ToolTypes_Turret : [
            "Radial","Axial"
        ],
        ChoosedTool_turrent: 0,        
        Tools_Path_turrent : [-1,-1,-1,-1,-1,-1,-1,-1],
        bUpdate : false,
        Tool_All_Group: [
            {},{}
        ],
        TurretMax: 10,
        MillingMax: 10,
        ToolMillingPathDatas :[],
        ToolTurretPathDatas :[],
        ToolDefault :{
            ToolLength: 0,
            Diameter: 0,
            TipRadius: 0,
            XOffset: 0,
            ZOffset: 0,
            tooltypeID: -1,
            WidthOfCut: 0,
            flutes: 2,
        },
        MessageInfo:{
            NoneSetting:"None",
            MillingName:"Milling Tool",
            TurretName:"Turret Tool",
        },
        ToolType_Milling:[
            {
                TypeName:"Holder Drill",
                IMG : "/iconholderdrill.jpg",
            },
            {
                TypeName:"Holder End Mill",
                IMG : "/iconholderendmill.jpg",
            },
            {
                TypeName:"Holder Tap",
                IMG : "/iconholdertap.jpg",
            },
            {
                TypeName:"Holder Face Mill",
                IMG : "/iconholderfacemill.jpg",
            },
        ],
        ToolType_Turret:[
            {
                TypeName:"Lathe Turning",
                IMG : "/Lathe_Turning.png",
                ItemType:"Radial",
            },
            {
                TypeName:"Lathe Facing",
                IMG : "/Lathe_Facing.png",
                ItemType:"Radial",
            },
            {
                TypeName:"External Thread",
                IMG : "/External_Threading.png",
                ItemType:"Radial",
            },
            {
                TypeName:"Lathe Turning Center",
                IMG : "/Lathe_Turning_Center.png",
                ItemType:"Radial",
            },
            {
                TypeName:"EXTERNAL GROOVING",
                IMG : "/EXTERNAL_GROOVING.png",
                ItemType:"Radial",
            },
            {
                TypeName:"Boring Bar",
                IMG : "/Boring_Bar.png",
                ItemType:"Axial",
            },
            {
                TypeName:"Internal thread",
                IMG : "/Internal_threading.png",
                ItemType:"Axial",
            },
        ],
    },
    mutations: {
        //ToolTurretPathDatas
        Add_ToolTurretPathDatas(state, payload){
            state.ToolTurretPathDatas.push(JSON.parse(payload));
        },
        Edit_ToolTurretPathDatas(state, payload){
            let getvalues = JSON.parse(payload);
            state.ToolTurretPathDatas[getvalues.index] = JSON.parse(getvalues.datas);
            //update
            state.ToolTurretPathDatas.push(getvalues);
            state.ToolTurretPathDatas.pop();
        },
        //ToolMillingPathDatas
        Add_ToolMillingPathDatas(state, payload){
            state.ToolMillingPathDatas.push(JSON.parse(payload));
        },
        Edit_ToolMillingPathDatas(state, payload){
            let getvalues = JSON.parse(payload);
            state.ToolMillingPathDatas[getvalues.index] = JSON.parse(getvalues.datas);
            //update
            state.ToolMillingPathDatas.push(getvalues);
            state.ToolMillingPathDatas.pop();
        },
        //Save sys data
        SaveParameter_Tools(state) {
            state.Tool_All_Group[0] = state.ToolTurretPathDatas;
            state.Tool_All_Group[1] = state.ToolMillingPathDatas;
        },
        //load sys data
        LoadParameter_Tools(state, payload) {
            state.Tool_All_Group = JSON.parse(payload);
            state.ToolTurretPathDatas = state.Tool_All_Group[0];
            state.ToolMillingPathDatas = state.Tool_All_Group[1];
        },


        //update
        updateToolAllparas(state, payload){
            state.bUpdate = payload;
        },
        //
        AddTool_turrent(state, payload){
            let getvalues = JSON.parse(payload);
            state.Tools_turrent.push(getvalues);
        },
        EditTool_turrent(state, payload){
            let getvalues = JSON.parse(payload);
            state.Tools_turrent[getvalues.index] = JSON.parse(getvalues.datas);
            state.Tools_turrent.push(getvalues);
            state.Tools_turrent.pop();
        },
        DeleteTool_turrent(state, payload){
            let getvalues = JSON.parse(payload);
            state.Tools_turrent[getvalues.index] = JSON.parse(getvalues.datas);
            state.Tools_turrent = state.Tools_turrent.splice(3, 1);
            state.Tools_turrent.pop();
        },
        //
        LoadParameter_Tools_turrent(state, payload) {
            state.Tools_turrent = JSON.parse(payload);
        },
        LoadParameter_Tools_Path_turrent(state, payload) {
            state.Tools_Path_turrent = JSON.parse(payload);
        },
        //turret path
        EditToolPath_turrent(state, payload){
            let getvalues = JSON.parse(payload);
            if(getvalues.index >= MaxToolNumber_Turret ) return;
            state.Tools_Path_turrent[getvalues.index] = getvalues.datas;
        },
    },
    
}
