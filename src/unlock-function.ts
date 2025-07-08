export interface UnlockFunction {
  <GReturn>(context: () => GReturn): GReturn;
}
