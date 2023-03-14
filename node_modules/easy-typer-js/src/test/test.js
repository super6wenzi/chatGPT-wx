import EasyTyper from '../ts/index'

const obj = {
  output: '',
  type: 'rollback',
  isEnd: false,
  speed: 80,
  backSpeed: 40,
  sleep: 3000,
  singleBack: true,
  sentencePause: true
}

let result = ''

const typed = (context) => {
  new EasyTyper(obj, context, ()=>{
    console.log('result', result)
  }, (output, instance) => {
    result = `${output}`
  })
}

jest.useFakeTimers();


it('1. 输出：黎明前的黑暗是最深不见底的黑暗！', () => {
  typed('黎明前的黑暗是最深不见底的黑暗！');
  jest.runAllTimers();
  expect(result).toBe('黎明前的黑暗是最深不见底的黑暗！')
});


it('2. 输出：人活着就是为了提升心性，磨炼灵魂！', () => {
  typed('人活着就是为了提升心性，磨炼灵魂！');
  jest.runAllTimers();
  expect(result).toBe('人活着就是为了提升心性，磨炼灵魂！')
});