let inputName = document.querySelector(".account-name");
inputName.addEventListener("input", () => {
  inputName.value = inputName.value.replace(/[^A-Za-z ]/g, "");
  let feedback = document.querySelector(".feedback");
  feedback.innerHTML = `<p class="error">Only letters are allowed<span class="error-icon">X</span></p>`;
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("create")) {
    console.log("clicked:", e.target.classList);
    showForm();

    setAccount();
  }

  if (e.target.classList.contains("deposit-btn")) {
    return depositMoney();
  }

  if (e.target.classList.contains("withdraw-btn")) {
    return withdrawals();
  }

  if (e.target.classList.contains("transfer-btn")) {
    return transfer();
  }

  if (e.target.classList.contains("find")) {
    return findAccount();
  }
});

function showForm() {
  let accountForm = document.querySelector(".account-form");
  accountForm.style.display = "block";
}

let bank = createBank();
let accounts;
let userAccount;
let feedback = document.querySelector(".feedback");
function clearInput() {
  let input = document.querySelector(".account-name");
  let sumInput = document.querySelector(".amount-field");
  input.value = "";
  sumInput.value = "";
}

function setAccount() {
  let input = document.querySelector(".account-name");
  let owner = input.value;

  if (!input.value) {
    return;
  }

  if (!bank.findOwner(owner)) {
    userAccount = bank.createAccount(owner);
    bank.setAccount(userAccount);

    input.value = "";

    let balance = userAccount.getBalance();

    feedback.innerHTML = `<p class="success"> Thank you to create a new account <span class="owner"> ${owner}</span>, your balance is £${balance} <i class="fa-solid fa-check"></i></p>`;

    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner} : £${balance}</p>`;
    updateAccount();

    localStorage.setItem(
      "savedAccount",
      JSON.stringify(bank.showAllAccounts())
    );
    let savedAccounts = JSON.parse(localStorage.getItem("savedAccount"));
    console.log(savedAccounts);
  } else {
    //“Hey bank, please store this new account for this owner inside your accounts list.”

    feedback.innerHTML = `<p class="error">You already have an account<span class="error-icon">X</span></p>`;
  }
}

function updateAccount() {
  let accountList = document.querySelector(".account-list");
  let allAccounts = bank.showAllAccounts();
  accountList.innerHTML = "";
  allAccounts.forEach((accounts) => {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `
  

<div class="name">
<p> Name</p>
<p class="owner-name">${accounts.getOwner()}</p>

</div>
<div class="balance">
<p>Balance:</p>
<p class="owner-balance">£${accounts.getBalance()}</p>
</div>
</div>
`;
    localStorage.setItem("savedName", accounts.getOwner());
    localStorage.setItem("savedBalance", accounts.getBalance());
    accountList.appendChild(newDiv);
    let ownerName = document.querySelector(".owner-name");
    console.log(ownerName);
  });
}

function depositMoney() {
  let sumInput = document.querySelector(".amount-field");
  let amount = parseFloat(sumInput.value);
  if (userAccount && amount && !isNaN(amount) && amount > 0) {
    enableBtn();

    let sumInput = document.querySelector(".amount-field");
    let owner = userAccount.getOwner();
    let amount = parseFloat(sumInput.value);
    userAccount.deposit(amount);
    let balance = userAccount.getBalance();
    feedback.innerHTML = `<p class="success">Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance} <i class="fa-solid fa-check"></i></p>`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;
    updateAccount();
  }
  if (userAccount && !amount) {
    feedback.innerHTML = `<p class="error">Please, add amount before depositing<span class="error-icon">X</span></p>`;
  }
  if (!userAccount && !accountFound) {
    disableBtn();
  }

  let input = document.querySelector(".account-name");
  let owner = input.value;
  let accountFound = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === owner);

  if (accountFound && !isNaN(amount) && amount > 0) {
    enableBtn();

    let sumInput = document.querySelector(".amount-field");
    let owner = accountFound.getOwner();
    document.body.style.backgroundColor = "orange";
    let amount = parseFloat(sumInput.value);
    accountFound.deposit(amount);

    let balance = accountFound.getBalance();
    sumInput.value = "";
    feedback.innerHTML = `<p class="success">Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance} <i class="fa-solid fa-check"></i></p>`;

    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;
    updateAccount();
  }
  if (!accountFound && !userAccount) {
    disableBtn();

    feedback.innerHTML = `<p class="error">Please, create an account before depositing<span class="error-icon">X</span></p>`;
  }
}

console.log(bank.showAllAccounts().length);
function disableBtn() {
  let button = document.querySelector(".deposit-btn");
  button.disabled = true;
}

function enableBtn() {
  let button = document.querySelector(".deposit-btn");
  button.disabled = false;
}

function withdrawals() {
  if (!userAccount) {
    feedback.innerHTML = `<p class="error">Please, create an account before withdrawing!<span class="error-icon">X</span></p>`;
  } else {
    let sumInput = document.querySelector(".amount-field");
    let input = document.querySelector(".account-name");
    let amount = parseInt(sumInput.value);
    let owner = input.value;
    let accountOwner = userAccount.getOwner(owner);

    userAccount.withdraw(amount);
    let balance = userAccount.getBalance();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${accountOwner}: £${balance}</p>`;

    feedback.innerHTML = `<p class="success"> Withdrew: £${amount}, Balance: £${balance}! <i class="fa-solid fa-check"></i></p>`;
    updateAccount();
  }
  if (!amount) {
    feedback.innerHTML = `<p class="error">Please, add amount before withdrawing!<span class="error-icon">X</span></p>`;
  }
  if (amount > balance) {
    feedback.innerHTML = `<p class="error"> Insufficient funds!<span class="error-icon">X</span></p>`;
  }
}

function transfer() {
  if (!userAccount) {
    feedback.innerHTML = `<p class="error">Please, create an account before making a transfer <span class="error-icon">X</span></p>`;
  }

  let transferAmount = document.querySelector(".transfer-amount");
  let receiverInput = document.querySelector(".receiver");
  let senderInput = document.querySelector(".sender");

  let transAmount = parseInt(transferAmount.value);
  let receiver = receiverInput.value;
  let sender = senderInput.value;

  let findSender = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === sender);
  let findReceiver = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === receiver);
  let balance = userAccount.getBalance();

  if (!findSender || !findReceiver) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="error">No account found<span class="error-icon">X</span></p> `;
    return; //stop the function.
  }
  if (findSender.getBalance() === 0) {
    feedback.innerHTML = `<p class="error">No enough funds to make transfer<span class="error-icon">X</span> </p>`;
    return;
  }

  if (!transAmount) {
    feedback.innerHTML = `<p class="error">Enter amount before making transfer<span class="error-icon">X</span> </p>`;
    return; //stop the function.
  }

  if (transAmount > balance || balance === 0) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="error">insufficient funds<span class="error-icon">X</span></p> `;
    return; //stop the function.
  }
  if (findSender && findReceiver) {
    bank.transfer(sender, receiver, transAmount);
    let balance = findSender.getBalance();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${sender}: £${balance}</p>`;
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="success">Thank you ${sender}, you successfully sent  £${transAmount} to ${receiver},your balance is now: £${balance} <i class="fa-solid fa-check"></i> </p>`;
    updateAccount();
  }
}

function findAccount() {
  let input = document.querySelector(".account-name");
  let owner = input.value.trim();

  let accountFound = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === owner);

  if (accountFound) {
    let balance = accountFound.getBalance();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;
    feedback.innerHTML = `<p class="success">Account found, Balance : £${balance}</p>`;
    let ownerName = document.querySelector(".owner-name");
    console.log(ownerName);
    ownerName.style.color = "red";
    updateAccount();
  }
  if (!accountFound) {
    feedback.innerHTML = `<p class="error">No account found<span class="error-icon">X</span></p>`;
  }
}

/*
  if (accountFound) {
    let sumInput = document.querySelector(".amount-field");
    let amount = parseInt(sumInput.value);
    accountFound.deposit(amount);
let accountOwner = userAccount.getOwner();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;

    updateAccount();
  }
}
  */

function createAccount(owner) {
  let balance = 0;
  return {
    getOwner() {
      return owner;
    },

    deposit(amount) {
      return (balance += parseInt(amount));
    },

    withdraw(amount) {
      if (balance > amount || balance === amount) {
        return `${owner} withdrew ${amount}.Remaining balance:£${(balance -=
          amount)}`;
      }
      if (amount > balance) {
        return `insufficient funds`;
      }
    },
    getBalance() {
      return balance;
    },
  };
}

function createBank() {
  let accounts = [];

  return {
    createAccount(owner) {
      return createAccount(owner);
    },
    setAccount(account) {
      if (!accounts.includes(account)) accounts.push(account);
    },

    findOwner(owner) {
      //accounts.find(...) searches through the vault (the array of accounts).For each account, it asks who owns this account by calling getOwner().When it finds a match, it returns the entire account object.
      let findOwner = accounts.find((account) => account.getOwner() === owner);
      return findOwner; //it gives you the whole account object that contains deposit(), withdraw(), getBalance(), etc.
    },

    transfer(senderName, receiverName, amount) {
      let sender = this.findOwner(senderName); //use the findOwner method that belongs to this same bank.”
      let receiver = this.findOwner(receiverName);

      sender.withdraw(amount);
      receiver.deposit(amount);
    },
    showAllAccounts() {
      return accounts;
    },
  };
}
