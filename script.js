//obtendo as referências dos objetos HTML para altera-los via JS
const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// localStorage.getItem espera receber um array stringficado
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

//função para remover uma transação do DOM
const removeTransaction = ID => {
    //filtra as transações que são diferentes do ID passado
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

//função que adiciona as transações no DOM
const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    //método Math.abs para tirar o sinal de negativo
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = ` 
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button> `
    transactionsUl.append(li) // adiciona o item da lista na lista da árvore HTML/DOM
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

    // método filter para gerar novo array, filtrando através da regra 
    // determinada na função passada nele
const getIncomes = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

   //método reduce para iterar em um array e reduzir a um único objeto/valor
const getTotal = transactionsAmounts => transactionsAmounts
.reduce((accumulator, transaction) => accumulator + transaction, 0)
// método toFixed para adicionar 2 casas decimais
.toFixed(2)

//função que atualiza os valores (R$) no DOM
const updateBalanceValues = () => {
    // método map para iterar em um array de objetos e gerar um array de números
    const transactionsAmounts = transactions.map(({ amount }) => amount)
 
    const total = getTotal(transactionsAmounts)
    const income = getIncomes(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`

}

//Função que inicia as atualizações no DOM, é usada como ponto de partida
const init = () => {
    transactionsUl.innerHTML = ''
    // para cada item do objeto transactions é chamada a funcão addTransactionIntoDOM
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    // método localStorage.setItem adiciona no localStorage as transações
    // ele espera formato chave e valor, ambos no formato de string
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArrays = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        // tanto Number () quanto +transactionAmount irá fazer transformar em tipo number 
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ""

    if (isSomeInputEmpty) {
        alert('Necessário preencher Nome e Valor da transação!')
        return
    }

    addToTransactionsArrays(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)