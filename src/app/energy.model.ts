export class Energy{
    public value: string;
    constructor(public index, public name:string,public description: string, public imagePath: string, public available:boolean, public childrenSource: Energy[]){}
}