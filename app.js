// 설정 파일에서 값 가져오기 (config.js가 없으면 기본값 사용)
const SUPABASE_URL = (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL)
  ? CONFIG.SUPABASE_URL
  : 'https://hpgibccgftmuihbrxetn.supabase.co';

const SUPABASE_ANON_KEY = (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_ANON_KEY)
  ? CONFIG.SUPABASE_ANON_KEY
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2liY2NnZnRtdWloYnJ4ZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDE2MDIsImV4cCI6MjA4MDMxNzYwMn0.iR85ZLzeHrjjn9cbP9xOuNBX8IR4AO7f5NzHU9vCBqI';

const ADMIN_PASSWORD = (typeof CONFIG !== 'undefined' && CONFIG.ADMIN_PASSWORD)
  ? CONFIG.ADMIN_PASSWORD
  : 'admin2529';

if (typeof CONFIG === 'undefined') {
  console.log('config.js 파일이 없어 기본 설정을 사용합니다.');
}

let supabaseClient;
let currentUser = null;
let isAdmin = false;

const securityCodes = {
  1: '0247', 2: '1938', 3: '4501', 4: '5826', 5: '7093',
  6: '8610', 7: '3344', 8: '1199', 9: '2765', 10: '4082',
  11: '9900', 12: '6574', 13: '3210', 14: '7438', 15: '8855',
  16: '4607', 17: '5321', 18: '1740', 19: '2983', 20: '6116',
  21: '0471', 22: '2550', 23: '3869', 24: '4722', 25: '5087',
  26: '6394', 27: '7841', 28: '8562', 29: '9037', 30: '1406'
};

function setRuntimeBadge(message, isError) {
  const badge = document.getElementById('runtimeBadge');
  if (!badge) return;
  badge.textContent = message;
  badge.style.background = isError ? '#c62828' : '#2e7d32';
}

function normalizePassword(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function setCurrentUser(username) {
  currentUser = username;
  localStorage.setItem('currentUser', username);
}

function initSupabase() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) {
      setRuntimeBadge('Supabase 설정 오류', true);
      return false;
    }
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    setRuntimeBadge('JS 실행됨', false);
    return true;
  } catch (error) {
    console.error('Supabase 초기화 실패:', error);
    setRuntimeBadge('Supabase 초기화 실패', true);
    return false;
  }
}

function updateAdminButtonVisibility() {
  const adminButton = document.getElementById('generatorAdminButton');
  if (!adminButton) return;
  if (isAdmin) adminButton.classList.remove('hidden');
  else adminButton.classList.add('hidden');
}

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminPasswordScreen').classList.add('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('generatorScreen').classList.add('hidden');
  document.getElementById('loginError').classList.remove('show');
}

function showAdminPasswordScreen() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminPasswordScreen').classList.remove('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('generatorScreen').classList.add('hidden');
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminPasswordError').classList.remove('show');
  setRuntimeBadge('관리자 비밀번호 화면', false);
}

function showAdminPanel() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminPasswordScreen').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  document.getElementById('generatorScreen').classList.add('hidden');
  setRuntimeBadge('관리자 패널 화면', false);
  updateUserList();
}

function showGenerator() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminPasswordScreen').classList.add('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('generatorScreen').classList.remove('hidden');
  setRuntimeBadge('로그인 완료', false);
  updateAdminButtonVisibility();
}

function backToLogin() {
  showLogin();
}

function logout() {
  currentUser = null;
  isAdmin = false;
  localStorage.removeItem('currentUser');
  showLogin();
}

function openAdminMode() {
  if (isAdmin) {
    showAdminPanel();
    return;
  }
  showAdminPasswordScreen();
}

function verifyAdminPassword(event) {
  event.preventDefault();
  const input = document.getElementById('adminPassword');
  const errorDiv = document.getElementById('adminPasswordError');
  const password = normalizePassword(input.value);

  if (password === normalizePassword(ADMIN_PASSWORD)) {
    isAdmin = true;
    input.value = '';
    errorDiv.classList.remove('show');
    showAdminPanel();
    return;
  }

  errorDiv.textContent = '관리자 비밀번호가 올바르지 않습니다.';
  errorDiv.classList.add('show');
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  errorDiv.classList.remove('show');

  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data || data.password_hash !== password) {
      errorDiv.textContent = '사용자명 또는 비밀번호가 올바르지 않습니다.';
      errorDiv.classList.add('show');
      return;
    }

    setCurrentUser(username);
    isAdmin = data.is_admin || false;
    showGenerator();
  } catch (err) {
    errorDiv.textContent = '로그인 중 오류가 발생했습니다: ' + err.message;
    errorDiv.classList.add('show');
  }
}

async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const errorDiv = document.getElementById('registerError');
  const successDiv = document.getElementById('registerSuccess');
  errorDiv.classList.remove('show');
  successDiv.classList.remove('show');

  try {
    const { data: existingUser } = await supabaseClient
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      errorDiv.textContent = '이미 존재하는 사용자명입니다.';
      errorDiv.classList.add('show');
      return;
    }

    const { error } = await supabaseClient
      .from('users')
      .insert([{ username, password_hash: password, is_admin: false }])
      .select();

    if (error) {
      errorDiv.textContent = '사용자 등록 중 오류가 발생했습니다: ' + error.message;
      errorDiv.classList.add('show');
      return;
    }

    successDiv.textContent = '사용자가 성공적으로 등록되었습니다.';
    successDiv.classList.add('show');
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    await updateUserList();
  } catch (err) {
    errorDiv.textContent = '오류: ' + err.message;
    errorDiv.classList.add('show');
  }
}

async function deleteUser(username) {
  if (!confirm('정말로 사용자 "' + username + '"을(를) 삭제하시겠습니까?')) return;

  try {
    const { error } = await supabaseClient
      .from('users')
      .delete()
      .eq('username', username);

    if (error) {
      alert('사용자 삭제 중 오류가 발생했습니다: ' + error.message);
      return;
    }
    await updateUserList();
  } catch (err) {
    alert('오류: ' + err.message);
  }
}

async function updateUserList() {
  const userListDiv = document.getElementById('userList');
  userListDiv.innerHTML = '<p style="color: #999; text-align: center;">사용자 목록을 불러오는 중...</p>';

  try {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('username')
      .order('username');

    if (error) {
      userListDiv.innerHTML = '<p style="color: #c62828; text-align: center;">사용자 목록 오류: ' + error.message + '</p>';
      return;
    }

    if (!users || users.length === 0) {
      userListDiv.innerHTML = '<p style="color: #999; text-align: center;">등록된 사용자가 없습니다.</p>';
      return;
    }

    userListDiv.innerHTML = users.map((user) => `
      <div class="user-item">
        <span class="user-name">${user.username}</span>
        <button class="btn btn-danger delete-user-btn" type="button" data-username="${user.username}">삭제</button>
      </div>
    `).join('');
  } catch (err) {
    userListDiv.innerHTML = '<p style="color: #c62828; text-align: center;">오류: ' + err.message + '</p>';
  }
}

function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '오류: ' + message;
  errorMessage.classList.add('show');
  document.getElementById('resultContainer').classList.remove('show');
}

function generatePassword(event) {
  event.preventDefault();

  const year = parseInt(document.getElementById('year').value, 10);
  const month = parseInt(document.getElementById('month').value, 10);
  const day = parseInt(document.getElementById('day').value, 10);
  const securityCodeNum = parseInt(document.getElementById('securityCodeNum').value, 10);
  const errorMessage = document.getElementById('errorMessage');
  const resultContainer = document.getElementById('resultContainer');

  errorMessage.classList.remove('show');
  if (year < 0 || year > 99) return showError('연도는 0부터 99까지 입력해주세요.');
  if (month < 1 || month > 12) return showError('월은 1부터 12까지 입력해주세요.');
  if (day < 1 || day > 31) return showError('일은 1부터 31까지 입력해주세요.');
  if (securityCodeNum < 1 || securityCodeNum > 30) return showError('보안코드 번호는 1부터 30까지 입력해주세요.');

  const securityCode = securityCodes[securityCodeNum];
  const firstTwo = parseInt(securityCode.substring(0, 2), 10);
  const thirdDigit = parseInt(securityCode.substring(2, 3), 10);
  const fourthDigit = parseInt(securityCode.substring(3, 4), 10);

  const result1 = String(Math.floor(year * day + firstTwo)).padStart(2, '0').substring(0, 2);
  const result2 = String(Math.floor(month + year * thirdDigit)).padStart(2, '0').substring(0, 2);
  const result3 = String(Math.floor(day + month * fourthDigit)).padStart(2, '0').substring(0, 2);

  const result4 = String(Math.floor((year + day) * firstTwo)).padStart(2, '0').substring(0, 2);
  const result5 = String(Math.floor(month * year + thirdDigit)).padStart(2, '0').substring(0, 2);
  const result6 = String(Math.floor(day * month + fourthDigit)).padStart(2, '0').substring(0, 2);

  document.getElementById('password1').textContent = result1 + result2 + result3;
  document.getElementById('password2').textContent = result4 + result5 + result6;
  resultContainer.classList.add('show');
}

function showCopyFeedback(button) {
  const originalText = button.textContent;
  button.textContent = '복사됨!';
  button.classList.add('copied');
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('copied');
  }, 2000);
}

function fallbackCopyToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    showCopyFeedback(button);
  } catch (err) {
    alert('복사에 실패했습니다. 비밀번호를 직접 선택해주세요.');
  }
  document.body.removeChild(textArea);
}

function copyPassword(passwordId, button) {
  const passwordText = document.getElementById(passwordId).textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(passwordText)
      .then(() => showCopyFeedback(button))
      .catch(() => fallbackCopyToClipboard(passwordText, button));
  } else {
    fallbackCopyToClipboard(passwordText, button);
  }
}

function bindEventHandlers() {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('adminPasswordForm').addEventListener('submit', verifyAdminPassword);
  document.getElementById('registerForm').addEventListener('submit', registerUser);
  document.getElementById('passwordForm').addEventListener('submit', generatePassword);

  document.getElementById('adminModeLink').addEventListener('click', (event) => {
    event.preventDefault();
    showAdminPasswordScreen();
  });
  document.getElementById('adminBackButton').addEventListener('click', backToLogin);
  document.getElementById('panelBackButton').addEventListener('click', backToLogin);
  document.getElementById('generatorAdminButton').addEventListener('click', openAdminMode);
  document.getElementById('generatorLogoutButton').addEventListener('click', logout);

  document.querySelectorAll('.copy-btn[data-password-id]').forEach((button) => {
    button.addEventListener('click', () => {
      copyPassword(button.dataset.passwordId, button);
    });
  });

  document.getElementById('userList').addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-user-btn');
    if (!deleteButton) return;
    const username = deleteButton.dataset.username;
    if (username) deleteUser(username);
  });
}

window.addEventListener('error', (event) => {
  setRuntimeBadge('JS 오류 발생', true);
  alert('자바스크립트 오류: ' + event.message);
});

window.addEventListener('DOMContentLoaded', async () => {
  document.body.setAttribute('data-js-ready', '1');
  setRuntimeBadge('JS 로드 완료', false);
  bindEventHandlers();

  if (!initSupabase()) {
    alert('Supabase 설정이 필요합니다. 개발자 도구 콘솔을 확인하세요.');
    return;
  }

  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      const { data } = await supabaseClient
        .from('users')
        .select('*')
        .eq('username', savedUser)
        .single();
      if (data) {
        currentUser = savedUser;
        isAdmin = data.is_admin || false;
        showGenerator();
      } else {
        showLogin();
      }
    } catch (err) {
      showLogin();
    }
  } else {
    showLogin();
  }
});
