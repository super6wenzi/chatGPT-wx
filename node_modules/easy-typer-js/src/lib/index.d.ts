interface Typer {
    output: string;
    type: string;
    isEnd: boolean;
    speed: number;
    backSpeed: number;
    sleep: number;
    singleBack: boolean;
    sentencePause: boolean;
}
interface TyperAction {
    rollback: Function;
    normal: Function;
    custom: Function;
    [key: string]: any;
}
declare class EasyTyper {
    obj: Typer;
    input: Array<string>;
    timer: number;
    typeAction: TyperAction;
    fn: Function;
    hooks: Function;
    constructor(obj: Typer, input: Array<string> | string, fn: Function, hooks: Function);
    init(): void;
    play(): any;
    typedBack(): any;
    nextTick(): Promise<any>;
    getOutputType(): any;
    closeTimer(): void;
    sleep(ms: number): Promise<unknown>;
    close(): boolean;
}
export default EasyTyper;
