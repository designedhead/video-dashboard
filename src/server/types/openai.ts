export type Choices = {
  text: string;
  index: number;
  finish_reason: string;
};
export type AI_RES = {
  data: {
    choices: Choices[];
  };
};
