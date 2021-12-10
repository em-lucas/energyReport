export class Energy{
  public value?: number;
  public secondValue?: string;
  public thirdValue?: string;

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
    max = 1, //max of capacity
    high = 0.95,
    medium = 0.8,
    low = 0.7,
    min = 0.6 //min of capacity
  }


export enum ShapeLine {
  round = 0,
  square = 1,
  line = 2
}
