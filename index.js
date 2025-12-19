document.addEventListener("DOMContentLoaded", () => {
  let accountList = document.querySelector(".account-list");

  //When you save data to localStorage:JavaScript removes all methods only raw data properties remain the object is no longer an “Account”, just a plain object
  let savedName = localStorage.getItem("savedName");
  let savedBalance = localStorage.getItem("savedBalance");

  if (!savedName && savedBalance) {
    accountList.innerHTML = `<p>account not found</p>`;
  }

  accountList.innerHTML += `
  <div class="name">
<p> Name</p>
<p class="owner-name">${savedName}</p>

</div>
<div class="balance">
<p>Balance:</p>
<p class="owner-balance">£${savedBalance}</p>
</div>
</div>
`;
});

document.addEventListener("DOMContentLoaded", () => {
  let depositBox = document.getElementById("deposit-box");
  let savedName = localStorage.getItem("savedName");
  let savedBalance = localStorage.getItem("savedBalance");
  depositBox.innerHTML = `<p class="amount-text"><span class="owner">${savedName}</span> <span class="balance">£${savedBalance}</span></p>`;
});

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
  let owner = input.value.trim().toLowerCase();

  if (!input.value) {
    return;
  }

  if (!bank.findOwner(owner)) {
    userAccount = bank.createAccount(owner);
    bank.setAccount(userAccount);

    let balance = userAccount.getBalance();

    feedback.innerHTML = `<p class="success"> Thank you to create a new account <span class="owner"> ${owner}</span>, your balance is £${balance} <i class="fa-solid fa-check"></i></p>`;

    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;
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
  let input = document.querySelector(".account-name");
  let owner = input.value;
  enableBtn();
  let accountFound = bank
    .showAllAccounts()
    .find((accounts) => accounts.getOwner() === owner);
  let userAccount = accountFound;
  localStorage.setItem("activeAccount", userAccount);
  let amount = parseFloat(sumInput.value);

  if (!userAccount) {
    feedback.innerHTML = `<p class="error">Please, create an account before depositing<span class="error-icon">X</span></p>`;
    return;
  }
  if (!amount || amount <= 0) {
    feedback.innerHTML = `<p class="error">Please, add amount before depositing<span class="error-icon">X</span></p>`;
    return;
  }

  if (userAccount) {
    let sumInput = document.querySelector(".amount-field");

    let amount = parseFloat(sumInput.value);
    userAccount.deposit(amount);
    let balance = userAccount.getBalance();
    feedback.innerHTML = `<p class="success">Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance} <i class="fa-solid fa-check"></i></p>`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span><span class="balance">£${balance}</span></p>`;
    updateAccount();
    sumInput.value = "";
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

function findAccount() {
  let input = document.querySelector(".account-name");
  let owner = input.value;

  let accountFound = bank
    .showAllAccounts()
    .find((accounts) => accounts.getOwner() === owner);
  let userAccount = accountFound;
  if (userAccount) {
    let balance = userAccount.getBalance();
    let owner = userAccount.getOwner();

    feedback.innerHTML = `<p class="success">account found, balance:£${balance}<i class="fa-solid fa-check"></i> </p>`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;
  }

  if (!userAccount) {
    feedback.innerHTML = `<p class="error">No account found<i class="fa-solid fa-check"></i> </p>`;
  }
}

function withdrawals() {
  let sumInput = document.querySelector(".amount-field");
  let input = document.querySelector(".account-name");
  let owner = input.value;
  enableBtn();
  let accountFound = bank
    .showAllAccounts()
    .find((accounts) => accounts.getOwner() === owner);
  let userAccount = accountFound;

  if (!userAccount) {
    document.body.style.backgroundColor = "yellow";
    feedback.innerHTML = `<p class="error">Please, create an account before withdrawing!<span class="error-icon">X</span></p>`;
    return;
  }
  let amount = parseInt(sumInput.value);
  if (!amount || amount <= 0) {
    feedback.innerHTML = `<p class="error">Please, add amount before withdrawing!<span class="error-icon">X</span></p>`;

    return;
  }
  let balance = userAccount.getBalance();
  amount = parseInt(sumInput.value);

  if (amount > balance) {
    document.body.style.backgroundColor = "red";
    feedback.innerHTML = `<p class="error"> Insufficient funds!<span class="error-icon">X</span></p>`;
    return;
  }

  if (userAccount && amount) {
    document.body.style.backgroundColor = "violet";
    let sumInput = document.querySelector(".amount-field");
    let input = document.querySelector(".account-name");
    let amount = parseInt(sumInput.value);
    let owner = input.value;
    let accountOwner = userAccount.getOwner(owner);

    userAccount.withdraw(amount);
    let balance = userAccount.getBalance();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${accountOwner}<span class="balance"> £${balance}</span></p>`;

    feedback.innerHTML = `<p class="success"> Withdrew: £${amount}, Balance: £${balance}! <i class="fa-solid fa-check"></i></p>`;
    updateAccount();
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
  let receiver = receiverInput.value.trim().toLowerCase();
  let sender = senderInput.value.trim().toLowerCase();

  let findSender = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === sender);
  let findReceiver = bank
    .showAllAccounts()
    .find((account) => account.getOwner() === receiver);
  let balance = userAccount.getBalance();

  if (!findSender && !findReceiver) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="error">No account found<span class="error-icon">X</span></p> `;
    return; //stop the function.
  }

  if (receiverInput.value === "") {
    feedback.innerHTML = `<p class="error">Receiver account not found<span class="error-icon">X</span></p> `;
  }

  if (senderInput.value === "") {
    feedback.innerHTML = `<p class="error">Sender account not found<span class="error-icon">X</span></p> `;
  }

  if (receiverInput.value === senderInput.value) {
    feedback.innerHTML = `<p class="error">you can only transfer between different accounts!<span class="error-icon">X</span> </p>`;

    return;
  }
  if (findSender.getBalance() === 0) {
    feedback.innerHTML = `<p class="error">No enough funds to make transfer<span class="error-icon">X</span> </p>`;
    return;
  }

  if (!transAmount) {
    feedback.innerHTML = `<p class="error">Enter amount before making transfer<span class="error-icon">X</span> </p>`;
    return; //stop the function.
  }

  if (transAmount > findSender.getBalance() || findSender.getBalance() === 0) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="error">insufficient funds<span class="error-icon">X</span></p> `;
    return; //stop the function.
  }
  if (findSender && findReceiver && transAmount) {
    bank.transfer(sender, receiver, transAmount);
    let receiverBalance = findReceiver.getBalance();
    let balance = findSender.getBalance();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${sender}: <span class="balance">£${balance}</span></p>
    <i class="fa-solid fa-arrow-right-long"></i><p class="receiver">${receiver} ${receiverBalance}</p>`;

    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `<p class="success">Thank you ${sender}, you successfully sent  £${transAmount} to ${receiver}, your balance is now: £${balance} <i class="fa-solid fa-check"></i> </p>`;

    updateAccount();
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
      return (balance += parseFloat(amount));
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
