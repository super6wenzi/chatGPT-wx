var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EasyTyper {
    constructor(obj, input, fn, hooks) {
        checkKeyIsNull(obj);
        checkFieldIsError(obj);
        this.obj = obj;
        this.input = typeof input === 'string' ? [input] : input;
        this.fn = typeof fn === 'function' ? fn : function () { };
        this.hooks = typeof hooks === 'function' ? hooks : function () { };
        this.timer = 0;
        this.typeAction = {
            rollback: this.typedBack.bind(this),
            normal: this.play.bind(this),
            custom: this.fn
        };
        // 实例化完后立即执行打字输出
        this.init();
    }
    // 初始化
    init() {
        this.play();
    }
    // 打字
    play() {
        if (!this.input.length)
            return this.fn(this);
        let i = 0, stop = false, input = this.input.shift() || '';
        this.timer = setInterval(() => {
            if (i === input.length) {
                i = 0;
                stop = true;
                this.closeTimer();
            }
            if (this.obj.isEnd)
                return this.closeTimer();
            if (stop)
                return this.nextTick();
            this.obj.output = input.slice(0, i + 1);
            this.hooks(input.slice(0, i + 1), this);
            i++;
        }, this.obj.speed);
    }
    // 回滚方法
    typedBack() {
        // 如果句子出书完毕，且是句子暂停模式
        if (!this.input.length && this.obj.sentencePause)
            return this.fn(this);
        let input = this.obj.output;
        let i = input.length, stop = false;
        this.timer = setInterval(() => {
            if (i === -1) {
                this.obj.output = '';
                this.hooks('', this);
                i = 0;
                stop = true;
                this.closeTimer();
            }
            if (this.obj.isEnd) {
                this.closeTimer();
                return this.obj.singleBack = false;
            }
            if (stop) {
                this.obj.singleBack = false;
                return (() => {
                    const { length } = this.input;
                    return length ? this.play() : this.fn(this);
                })();
            }
            this.obj.output = input.slice(0, i + 1);
            this.hooks(input.slice(0, i + 1), this);
            i--;
        }, this.obj.backSpeed);
    }
    // 下一次触发方式
    nextTick() {
        return __awaiter(this, void 0, void 0, function* () {
            // 等待
            yield this.sleep(this.obj.sleep);
            return this.obj.singleBack ? this.typedBack() : this.getOutputType();
        });
    }
    // 输出方式
    getOutputType() {
        return this.typeAction[this.obj.type](this);
    }
    // 关闭定时器
    closeTimer() {
        clearInterval(this.timer);
    }
    // 线程等待
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // 结束
    close() {
        return this.obj.isEnd = true;
    }
}
// 错误提示语
const errorTip = (message) => {
    throw new Error(message);
};
// 校验参数完整性
const checkKeyIsNull = (obj) => {
    const props = {
        output: '',
        type: '',
        isEnd: false,
        speed: 80,
        backSpeed: 40,
        sleep: 3000,
        singleBack: false,
        sentencePause: false
    };
    const propsKeys = Object.keys(props);
    const objKeys = Object.keys(obj);
    if (propsKeys.length !== objKeys.length) {
        errorTip('配置对象错误: 字段数量不正确！');
    }
    propsKeys.forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
            errorTip('配置对象错误：字段值为null或undefined！');
        }
    });
};
// 检验参数类型
const checkFieldIsError = (obj) => {
    Object.keys(obj).forEach(key => {
        const proxy = EasyTyperStrategy[key](obj);
        if (proxy.check()) {
            proxy.showTip(key);
        }
    });
};
// 策略分发
const EasyTyperStrategy = (() => ({
    output: (obj) => {
        return new CheckField(`string`, obj.output);
    },
    type: (obj) => {
        return new CheckField(`string`, obj.type);
    },
    isEnd: (obj) => {
        return new CheckField(`boolean`, obj.isEnd);
    },
    speed: (obj) => {
        return new CheckField(`number`, obj.speed);
    },
    backSpeed: (obj) => {
        return new CheckField(`number`, obj.backSpeed);
    },
    sleep: (obj) => {
        return new CheckField(`number`, obj.sleep);
    },
    singleBack: (obj) => {
        return new CheckField(`boolean`, obj.singleBack);
    },
    sentencePause: (obj) => {
        return new CheckField(`boolean`, obj.sentencePause);
    },
}))();
// 字段校验类
class CheckField {
    constructor(type, field) {
        this.type = type;
        this.field = field;
    }
    check() {
        return typeof this.field !== `${this.type}`;
    }
    showTip(name) {
        errorTip(`配置对象错误：属性 ${name} 必须为 ${this.type} 类型！`);
    }
}
export default EasyTyper;
