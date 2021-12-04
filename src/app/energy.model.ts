export class Energy{
  public value?: number;
  public secondValue?: string;
    public width?: number;
    public height?: number;
    public top?: number;
    public left?: number;

    constructor(
        public index?, 
        public name?:string,
        public description?: string, 
        public imagePath?: string, 
        public available?:boolean, 
        public childrenSource?: Energy[],
        public status?:EnergyStatus,
        public intensity?: EnergyIntensity,
        public shapeLine?: ShapeLine,
        public color?: string
    ){}
}

export enum EnergyStatus {
    consuming = 0, //consuming energy
    sending = 1, //send enery
    notInUse = 2
  }

  
export enum EnergyIntensity {
    max = 0, //max of capacity
    high = 1,
    medium = 2,
    low = 3,
    min = 4 //min of capacity
  }


export enum ShapeLine {
  round = 0,
  square = 1,
  line = 2
}
