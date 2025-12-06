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
});

function showForm() {
  let accountForm = document.querySelector(".account-form");
  accountForm.classList.toggle("showform");
}

let bank = createBank();
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
    feedback.innerHTML = "Please,enter your name before creating an account!";
    return; //stop the function
  }
  if (!bank.findOwner(owner)) {
    userAccount = bank.createAccount(owner);
    bank.setAccount(userAccount);

    let balance = userAccount.getBalance();

    feedback.innerHTML = `Thank you to create a new account ${owner},your balance is £${balance}`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner} :£${balance}</p>`;
  } else {
    //“Hey bank, please store this new account for this owner inside your accounts list.”

    feedback.innerHTML = `you already have an account`;
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
<p> name</p>
<p>${accounts.getOwner()}</p>

</div>
<div class="balance">
<p>balance:</p>
<p>£${accounts.getBalance()}</p>
</div>
</div>
`;
    accountList.appendChild(newDiv);
  });
}
function depositMoney() {
  let sumInput = document.querySelector(".amount-field");
  let input = document.querySelector(".account-name");
  let amount = sumInput.value;
  let owner = input.value;
  let account = bank.findOwner(owner);
  if (!account) {
    feedback.innerHTML = "Please,create an account before depositing!";
    sumInput.value = "";
    return;
  }
  //Check for userAccount – ensures there’s an account to deposit into.

  account.deposit(amount);
  sumInput.value = "";
  let balance = account.getBalance();
  if (balance && userAccount) {
    feedback.innerHTML = `Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance}`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;
  } else {
    feedback.innerHTML = `Please, add money before depositing!`;
  }
  console.log(bank.showAllAccounts().length);
  updateAccount();
}

function withdrawals() {
  if (!userAccount) {
    feedback.innerHTML = `Please, create an account before withdrawing!`;
  } else {
    let sumInput = document.querySelector(".amount-field");
    let input = document.querySelector(".account-name");

    let owner = input.value;
    let account = bank.findOwner(owner);
    let balance = account.getBalance();
    let amount = sumInput.value;

    userAccount.withdraw(amount);
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;

    feedback.innerHTML = `withdrew:£${amount}, balance:£${balance}!`;
  }
  updateAccount();
}

function transfer() {
  if (!userAccount) {
    document.body.style.backgroundColor = "pink";
    feedback.innerHTML = `please,create an account before making a transfer `;
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
  let balance = findSender.getBalance();

  if (!findSender || !findReceiver) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `no account found `;
    return; //stop the function.
  }

  if (!transAmount) {
    feedback.innerHTML = `enter amount before making transfer `;
    return; //stop the function.
  }

  if (transAmount > balance || balance === 0) {
    let feedback = document.querySelector(".feedback");
    feedback.innerHTML = `insufficient funds `;
    return; //stop the function.
  }
  if (findSender && findReceiver) {
    bank.transfer(sender, receiver, transAmount);

    feedback.innerHTML = `${sender} sent £${transAmount} to ${receiver}`;
  }
  updateAccount();
}

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
      if (balance > amount) {
        return `${owner} withdrew ${amount}.Remaining balance:£${(balance -=
          amount)}`;
      } else {
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
