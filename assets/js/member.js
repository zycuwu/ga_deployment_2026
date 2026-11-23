// 教學用前端狀態，不是安全的登入系統。不要用於真實會員驗證。
"use strict";
(() => {
  const key = "daily-good-demo-member";
  let signedIn = false;
  try {
    signedIn = sessionStorage.getItem(key) === "yes";
  } catch (_) {}
  const form = document.querySelector("#login-form");
  function render() {
    const link = document.querySelector("#member-link");
    if (link) link.textContent = signedIn ? "示範會員" : "會員登入";
    const area = document.querySelector("#login-form-area"),
      welcome = document.querySelector("#member-welcome");
    if (area) area.hidden = signedIn;
    if (welcome) welcome.hidden = !signedIn;
  }
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = document.querySelector("#demo-account"),
        pw = document.querySelector("#demo-password"),
        message = document.querySelector("#login-message");
      const valid = a.value.trim() === "student" && pw.value === "demo1234";
      pw.value = "";
      if (!valid) {
        message.textContent = "請使用示範帳號 student 與示範密碼 demo1234。";
        return;
      }
      signedIn = true;
      try {
        sessionStorage.setItem(key, "yes");
      } catch (_) {}
      form.reset();
      message.textContent = "";
      render();
      document
        .querySelector("#member-welcome h2")
        .setAttribute("tabindex", "-1");
      document.querySelector("#member-welcome h2").focus();
    });
    document.querySelector("#fill-demo").onclick = () => {
      document.querySelector("#demo-account").value = "student";
      document.querySelector("#demo-password").value = "demo1234";
    };
    document.querySelector("#logout").onclick = () => {
      signedIn = false;
      try {
        sessionStorage.removeItem(key);
      } catch (_) {}
      render();
      document.querySelector("#demo-account").focus();
    };
  }
  render();
})();
