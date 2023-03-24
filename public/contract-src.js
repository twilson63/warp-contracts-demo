export function handle(state, action) {
  const input = action.input

  if (input.function === 'transfer') {
    ContractAssert(input.target, 'Target is required to transfer')
    ContractAssert(Number.isInteger(input.qty), 'Qty should be an number!')
    ContractAssert(state.balances[action.caller], 'Caller must have balance!')
    ContractAssert(state.balances[action.caller] > input.qty, 'Not enough tokens to transfer!')
    // if action caller balance is not defined set to zero
    if (state.balances[action.caller] === undefined || state.balances[action.caller] === null) {
      state.balances[action.caller] = 0
    }

    // if input.target balance is not defined set to zero
    if (state.balances[input.target] === undefined || state.balances[input.target] === null) {
      state.balances[input.target] = 0
    }

    // do transfer
    if (state.balances[action.caller] > input.qty) {
      state.balances[action.caller] -= input.qty
      state.balances[input.target] += input.qty
    }

    return { state }
  }

  if (input.function === 'balance') {
    const target = input.target || action.caller
    return { result: { target, balance: state.balances[target] } }
  }
  throw new ContractError('function not found!')
}