
const pageWrapperSelector = 'body > uni-app > uni-page > uni-page-wrapper > uni-page-body';

// auth page
const authSelectors = {
  ccLabel: `${pageWrapperSelector} > uni-view > uni-view:nth-child(5) > uni-text`,
  ccInput: `${pageWrapperSelector} > uni-view > uni-view.form-item > uni-view > uni-input > div > input`,
  ccConfirmBtn: `${pageWrapperSelector} > uni-view > uni-view.form-item > uni-button`,
  usernameInput: `${pageWrapperSelector} > uni-view > uni-view:nth-child(5) > uni-input > div > input`,
  passwordInput: `${pageWrapperSelector} > uni-view > uni-view:nth-child(7) > uni-input > div > input`,
  loginBtn: `${pageWrapperSelector} > uni-view > uni-button.login`,
};

// transaction hall page
const tranxModalSelector = `${pageWrapperSelector} > uni-view > uni-view.fui-dialog__wrap.fui-wrap__show`;
const tranxSelectors = {
  totalAssetsText: `${pageWrapperSelector} > uni-view > uni-view.money-num`,
  tranxBalText: `${pageWrapperSelector} > uni-view > uni-view.division-wrap > uni-view.division-left > uni-view.division-num`,
  walletBalText: `${pageWrapperSelector} > uni-view > uni-view.division-wrap > uni-view.division-right > uni-view.division-num`,
  orderBtn: `${pageWrapperSelector} > uni-view > uni-view.grab-orders-wrap.grab-orders-wrap1 > uni-button`,
  //within modal
  tranxModal: tranxModalSelector,
  sellBtn: `${tranxModalSelector} > uni-view > uni-view > uni-view.buttons > uni-button:nth-child(2)`,
  confirmBtn: `${tranxModalSelector} > uni-view > uni-view > uni-button`,
  tranxSuccessText: `${tranxModalSelector} > uni-view > uni-view > uni-view.success-text`,
};

export const pageSelectors = {
  auth: authSelectors,
  tranx: tranxSelectors,
};