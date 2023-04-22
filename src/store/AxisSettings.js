'use strict'
export default {
    namespaced: true,
	state: {   
        AxisDatas : [],            
        // EditAxisData:{
        //     CalCurrent:60,
        //     CalMaxAcceleration:30,
        //     GoBackDistance:-5,
        //     GoBackFeedrate:1000,
        //     GoEndstopDistance:320,
        //     GoEndstopFeedrate:1000,
        //     AbsPos:100,
        //     Current:100,
        //     MaxAcceleration:200,
        //     AxisLetter:"X",
        // },
    },
    mutations: {
        AddAxisDatas(state, payload){			
            state.AxisDatas.push(payload);
		},
		SaveDataJS(state, payload) {
			let getvalues = JSON.parse(payload);
            state.AxisDatas[getvalues.index] = JSON.parse(getvalues.datas);
            state.AxisDatas.push(getvalues);
            state.AxisDatas.pop();
        },
        LoadAllParameter(state, payload) {
			let getvalues = JSON.parse(payload);
            state.AxisDatas = getvalues;
        },
    },
}
