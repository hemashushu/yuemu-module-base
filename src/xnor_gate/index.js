const { Binary } = require('jsbinary');

const AbstractBaseLogicModule = require('../abstractbaselogicmodule');

class AndGate extends AbstractBaseLogicModule {

    init() {
        // 模块参数
        let inputPinCount = this.getParameter('inputPinCount'); // 输入端口的数量
        let bitWidth = this.getParameter('bitWidth'); // 数据宽度

        // 输出端口
        this.addOutputPinByDetail('out', bitWidth);

        // 输入端口的名称分别为 in0, in1, ... inN
        let createInputPin = (idx) => {
            this.addInputPinByDetail('in' + idx, bitWidth);
        };

        // 输入端口
        for (let idx = 0; idx < inputPinCount; idx++) {
            createInputPin(idx);
        }
    }

    getModuleClassName() {
        return 'xnor_gate'; // 同目录名
    }

    // override
    updateModuleDataAndOutputPinsData() {
        let datas = this.inputPins.map(pin => {
            return pin.getData();
        });

        // 当输入端口大于 2 时，后续的输入端口会依次进行 xor 运算，即
        // i = (a xor b) xor c
        // 然后再取反
        // out = not(i)
        //
        // 即，xnor 的运算结果为 xor 的运算的结果再 not 运算。
        //
        // https://en.wikipedia.org/wiki/XNOR_gate#More_than_two_inputs

        let resultData = datas[0];
        for (let idx = 1; idx < datas.length; idx++) {
            resultData = Binary.xor(resultData, datas[idx]);
        }

        resultData = Binary.not(resultData);
        this.outputPins[0].setData(resultData);
    }
}

module.exports = AndGate;