//obtendo as referências dos objetos HTML para altera-los via JS
const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

//Transações iniciais
let dummyTransactions = [
    {id: 1, name: 'Bolo de brigadeiro', amount: -20},
    {id: 2, name: 'Salário', amount: 300},
    {id: 3, name: 'Torta de Frango', amount: -10},
    {id: 4, name: 'Violão', amount: 150}
]

//função para remover uma transação do DOM
const removeTransaction = ID => {
    //filtra as transações que são diferentes do ID passado
    dummyTransactions = dummyTransactions.filter(transaction => transaction.id !== ID)
    init()
} 

//função que adiciona as transações no DOM
const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    //método Math.abs para tirar o sinal de negativo
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = ` 
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button> 
    `
    transactionsUl.append(li) // adiciona o item da lista na lista da árvore HTML/DOM
}

//função que atualiza os valores (R$) no DOM
const updateBalanceValues = () => {
    // método map para iterar em um array de objetos e gerar um array de números
    const transactionsAmounts = dummyTransactions
        .map(transaction => transaction.amount)
 
    //método reduce para iterar em um array e reduzir a um único objeto/valor
    const total = transactionsAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        // método toFixed para adicionar 2 casas decimais
        .toFixed(2)

    // método filter para gerar novo array, filtrando através da regra determinada na função passada nele
    const income = transactionsAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)

    const expense = Math.abs( transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`


}

//Função que inicia as atualizações no DOM, é usada como ponto de partida
const init = () => {
    transactionsUl.innerHTML = ''
    // para cada item do objeto dummyTransactions é chamada a funcão addTransactionIntoDOM
    dummyTransactions.forEach(addTransactionIntoDOM) 
    updateBalanceValues()    
}

init()

const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if (transactionName === '' || transactionAmount === "") {
        alert ('Necessário preencher Nome e Valor da transação!')
        return
    }

    const transaction = {
        id: generateID(),
        name: transactionName,
        // tanto Number () quanto +transactionAmount irá fazer transformar em tipo number 
        amount: Number(transactionAmount)  
    }

    dummyTransactions.push(transaction)
    init()

    inputTransactionName.value = ''
    inputTransactionAmount.value = ''

})