// Estado global de la aplicación
const state = {
  currentUser: '',
  balancesHidden: {
    savings: true,
    card: true
  }
};

// ==========================================================================
// FUNCIONES DE LOGIN
// ==========================================================================

/**
 * Muestra un mensaje de error en la pantalla de login
 */
function showLoginError(message) {
  const errorEl = document.getElementById('login-error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    // Reiniciar animación de sacudida
    errorEl.style.animation = 'none';
    errorEl.offsetHeight; // Disparar reflow
    errorEl.style.animation = 'shakeError 0.4s ease-in-out';
  }
}

/**
 * Limpia y oculta el mensaje de error de login
 */
function clearLoginError() {
  const errorEl = document.getElementById('login-error-message');
  if (errorEl) {
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
  }
}

/**
 * Valida el campo de usuario para activar/desactivar el botón Continuar
 */
function validateUsername() {
  const usernameInput = document.getElementById('username');
  const btnContinue = document.getElementById('btn-continue');

  if (usernameInput.value.trim().length > 0) {
    btnContinue.removeAttribute('disabled');
  } else {
    btnContinue.setAttribute('disabled', 'true');
  }

  clearLoginError();
}

/**
 * Pasa al paso de contraseña tras ingresar el usuario
 */
function goToPasswordStep(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();

  if (!username) return;

  clearLoginError();
  state.currentUser = username;

  // Ocultar paso 1, mostrar paso 2
  document.getElementById('login-step-username').classList.add('hidden');
  document.getElementById('login-step-password').classList.remove('hidden');

  // Limpiar, restablecer tipo a password y enfocar campo de clave
  const passwordInput = document.getElementById('password');
  passwordInput.value = '';
  passwordInput.type = 'password';
  document.getElementById('password-eye-hidden').classList.remove('hidden');
  document.getElementById('password-eye-visible').classList.add('hidden');

  document.getElementById('btn-login').setAttribute('disabled', 'true');
  passwordInput.focus();
}

/**
 * Valida el campo de contraseña para activar/desactivar el botón Ingresar
 */
function validatePassword() {
  const passwordInput = document.getElementById('password');
  const btnLogin = document.getElementById('btn-login');

  if (passwordInput.value.length > 0) {
    btnLogin.removeAttribute('disabled');
  } else {
    btnLogin.setAttribute('disabled', 'true');
  }

  clearLoginError();
}

/**
 * Regresa al paso de ingreso de usuario
 */
function backToUsernameStep(event) {
  event.preventDefault();

  clearLoginError();

  // Ocultar paso 2, mostrar paso 1
  document.getElementById('login-step-password').classList.add('hidden');
  document.getElementById('login-step-username').classList.remove('hidden');

  // Enfocar campo de usuario
  document.getElementById('username').focus();
}

/**
 * Muestra/oculta el texto de la contraseña en la pantalla de login
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeHidden = document.getElementById('password-eye-hidden');
  const eyeVisible = document.getElementById('password-eye-visible');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeHidden.classList.add('hidden');
    eyeVisible.classList.remove('hidden');
  } else {
    passwordInput.type = 'password';
    eyeHidden.classList.remove('hidden');
    eyeVisible.classList.add('hidden');
  }
}

/**
 * Maneja el envío del formulario de clave e inicia la sesión
 */
function handleLogin(event) {
  event.preventDefault();

  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;

  if (!password) return;
  if (!state.currentUser) return;

  // Validar credenciales juntas (usuario y contraseña)
  if (state.currentUser.toLowerCase() !== 'jvazquez2025' || password !== 'guayatuna*2025') {
    showLoginError('El usuario o la contraseña ingresados son incorrectos.');
    passwordInput.value = '';
    document.getElementById('btn-login').setAttribute('disabled', 'true');
    passwordInput.focus();
    return;
  }

  clearLoginError();

  // Formateamos el nombre para el perfil (Capitalizado)
  const username = state.currentUser;
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  const fullName = "Francisco Vázquez"

  // Actualizar tanto el navbar como el encabezado del dropdown del perfil
  document.getElementById('profile-name').textContent = fullName;
  document.getElementById('dropdown-user-name').textContent = fullName;

  // Transición suave entre vistas
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  loginView.classList.remove('active');
  loginView.classList.add('hidden');

  dashboardView.classList.remove('hidden');
  dashboardView.classList.add('active');

  // Limpiamos los inputs del login por seguridad y restablecemos al paso 1
  document.getElementById('username').value = '';
  passwordInput.value = '';
  passwordInput.type = 'password';
  document.getElementById('btn-continue').setAttribute('disabled', 'true');
  document.getElementById('btn-login').setAttribute('disabled', 'true');

  document.getElementById('login-step-username').classList.remove('hidden');
  document.getElementById('login-step-password').classList.add('hidden');
}

/**
 * Abre el modal de confirmación para cerrar sesión
 */
function openLogoutConfirmModal() {
  // Cerrar el dropdown del perfil si está abierto
  document.getElementById('profile-dropdown').classList.add('hidden');
  // Mostrar modal de confirmación
  document.getElementById('logout-confirm-modal').classList.remove('hidden');
}

/**
 * Cierra el modal de confirmación de cierre de sesión
 */
function closeLogoutConfirmModal() {
  document.getElementById('logout-confirm-modal').classList.add('hidden');
}

/**
 * Confirma el cierre de sesión y ejecuta la desconexión
 */
function confirmLogout() {
  closeLogoutConfirmModal();
  handleLogout();
}

/**
 * Cierra la sesión del usuario y regresa a la pantalla de login en el Paso 1
 */
function handleLogout() {
  state.currentUser = '';

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  dashboardView.classList.remove('active');
  dashboardView.classList.add('hidden');

  loginView.classList.remove('hidden');
  loginView.classList.add('active');

  // Restablecer inputs e interfaces de login al Paso 1
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('btn-continue').setAttribute('disabled', 'true');
  document.getElementById('btn-login').setAttribute('disabled', 'true');

  document.getElementById('login-step-username').classList.remove('hidden');
  document.getElementById('login-step-password').classList.add('hidden');

  // Resetear saldos a ocultos por defecto al cerrar sesión
  resetBalances();
}

/**
 * Alterna la visibilidad del menú desplegable de perfil
 */
function toggleProfileMenu(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('profile-dropdown');
  const isHidden = dropdown.classList.contains('hidden');

  if (isHidden) {
    // Calcular dinámicamente la última conexión actual
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    document.getElementById('dropdown-last-connection').textContent = `Última conexión ${formattedDate} ${formattedTime}`;

    dropdown.classList.remove('hidden');
  } else {
    dropdown.classList.add('hidden');
  }
}


// ==========================================================================
// FUNCIONES DE ESCRITORIO
// ==========================================================================

/**
 * Alterna la visibilidad de los saldos bancarios en la tarjeta correspondiente
 * @param {HTMLElement} buttonEl - El botón clicado
 */
function toggleBalance(buttonEl) {
  const card = buttonEl.closest('.account-card');
  if (!card) return;

  const balanceVal = card.querySelector('.balance-value');
  const totalVal = card.querySelector('.footer-value');
  const eyeHiddenIcon = buttonEl.querySelector('.eye-icon.id-eye-hidden');
  const eyeVisibleIcon = buttonEl.querySelector('.eye-icon.id-eye-visible');

  const isHidden = eyeVisibleIcon.classList.contains('hidden');

  if (isHidden) {
    // Mostrar saldo
    if (balanceVal) balanceVal.textContent = balanceVal.getAttribute('data-value');
    if (totalVal) totalVal.textContent = totalVal.getAttribute('data-value');
    if (eyeHiddenIcon) eyeHiddenIcon.classList.add('hidden');
    if (eyeVisibleIcon) eyeVisibleIcon.classList.remove('hidden');
  } else {
    // Ocultar saldo
    if (balanceVal) balanceVal.textContent = '$**.**';
    if (totalVal) totalVal.textContent = '$**.**';
    if (eyeHiddenIcon) eyeHiddenIcon.classList.remove('hidden');
    if (eyeVisibleIcon) eyeVisibleIcon.classList.add('hidden');
  }
}

/**
 * Resetea todos los saldos a su estado oculto inicial
 */
function resetBalances() {
  const cards = document.querySelectorAll('.account-card');
  cards.forEach(card => {
    const balanceVal = card.querySelector('.balance-value');
    const totalVal = card.querySelector('.footer-value');
    const btn = card.querySelector('.toggle-balance-btn');

    if (balanceVal) balanceVal.textContent = '$**.**';
    if (totalVal) totalVal.textContent = '$**.**';

    if (btn) {
      const eyeHiddenIcon = btn.querySelector('.eye-icon.id-eye-hidden');
      const eyeVisibleIcon = btn.querySelector('.eye-icon.id-eye-visible');
      if (eyeHiddenIcon) eyeHiddenIcon.classList.remove('hidden');
      if (eyeVisibleIcon) eyeVisibleIcon.classList.add('hidden');
    }
  });
}

/**
 * Filtra los contactos favoritos dinámicamente según lo ingresado en el buscador lateral
 */
function filterFavorites() {
  const searchInput = document.getElementById('sidebar-search-input');
  const filterText = searchInput.value.toLowerCase().trim();
  const favoriteCards = document.querySelectorAll('.favorite-card');

  favoriteCards.forEach(card => {
    const nameSpan = card.querySelector('.contact-name');
    const name = nameSpan.textContent.toLowerCase();

    if (name.includes(filterText)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}


// ==========================================================================
// FUNCIONES DE MODAL Y TRANSFERENCIA SIMULADA
// ==========================================================================

let activeRecipient = '';

/**
 * Abre el modal de transferencia para el contacto seleccionado
 * @param {string} recipientName 
 */
function openTransferModal(recipientName) {
  activeRecipient = recipientName;

  // Limpiamos los puntos suspensivos si el nombre está truncado
  const displayName = recipientName.endsWith('...')
    ? recipientName.slice(0, -3)
    : recipientName;

  document.getElementById('modal-recipient-name').textContent = displayName;
  document.getElementById('transfer-amount').value = '';
  document.getElementById('transfer-concept').value = '';

  document.getElementById('transfer-modal').classList.remove('hidden');
  document.getElementById('transfer-amount').focus();
}

/**
 * Cierra el modal de transferencia
 */
function closeTransferModal() {
  document.getElementById('transfer-modal').classList.add('hidden');
  activeRecipient = '';
}

/**
 * Confirma y realiza la transferencia simulada
 */
function confirmTransfer() {
  const amountInput = document.getElementById('transfer-amount');
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    amountInput.classList.add('shake');
    setTimeout(() => amountInput.classList.remove('shake'), 500);
    alert('Por favor ingresa un monto válido mayor a 0.');
    return;
  }

  const displayName = document.getElementById('modal-recipient-name').textContent;

  // Ocultamos modal
  closeTransferModal();

  // Mostramos toast de éxito personalizado
  showSuccessToast(`¡Transferencia de $${amount.toFixed(2)} a ${displayName} enviada con éxito!`);
}

/**
 * Muestra el toast de éxito en la esquina inferior derecha
 * @param {string} message 
 */
function showSuccessToast(message) {
  const toast = document.getElementById('toast-success');
  const toastMsg = document.getElementById('toast-msg');

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  // Ocultar automáticamente a los 4 segundos
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

// ==========================================================================
// LISTENERS GLOBALES
// ==========================================================================

// Cierra el menú desplegable del perfil al hacer clic en cualquier parte fuera de él
window.addEventListener('click', function (e) {
  const dropdown = document.getElementById('profile-dropdown');
  const profileContainer = document.querySelector('.profile-container');

  if (dropdown && !dropdown.classList.contains('hidden')) {
    if (profileContainer && !profileContainer.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  }
});

/**
 * Calcula y actualiza dinámicamente los días restantes para el vencimiento
 * de los depósitos a plazo fijo de acuerdo a la fecha actual y la fecha objetivo.
 */
function updateExpiryDays() {
  const elements = document.querySelectorAll('.expiry-label');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  elements.forEach(el => {
    const expiryStr = el.getAttribute('data-expiry');
    const dateStr = el.getAttribute('data-date-str');
    if (!expiryStr) return;

    // Usar split para evitar problemas con desfase de zona horaria: YYYY-MM-DD
    const parts = expiryStr.split('-');
    const expiryDate = new Date(parts[0], parts[1] - 1, parts[2]);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      el.textContent = `Vence en ${diffDays} días(${dateStr})`;
    } else if (diffDays === 0) {
      el.textContent = `Vence hoy(${dateStr})`;
    } else {
      el.textContent = `Vencido hace ${Math.abs(diffDays)} días(${dateStr})`;
    }
  });
}

// Inicializar el cálculo al cargar el script
updateExpiryDays();

/**
 * Abre el modal de simulación/detalles de inversión y lo pre-llena con los valores correspondientes.
 * @param {HTMLElement} element - El elemento span que fue presionado
 */
function triggerInvestmentModal(element) {
  const rate = parseFloat(element.getAttribute('data-rate')) || 5.35;
  const term = parseInt(element.getAttribute('data-term')) || 361;
  const rawValue = element.getAttribute('data-value') || '500000';
  const cleanValue = rawValue.replace(/[$,]/g, '');
  const value = parseFloat(cleanValue) || 500000;

  document.getElementById('inv-calc-amount').value = value;
  document.getElementById('inv-calc-rate').value = rate;
  document.getElementById('inv-calc-term').value = term;

  calculateInvestment();

  document.getElementById('investment-modal').classList.remove('hidden');
}

/**
 * Cierra el modal de simulación/detalles de inversión.
 */
function closeInvestmentModal(event) {
  if (event) event.stopPropagation();
  document.getElementById('investment-modal').classList.add('hidden');
}

/**
 * Calcula el rendimiento neto y el total a recibir basándose en las entradas del simulador.
 */
function calculateInvestment() {
  const amountInput = document.getElementById('inv-calc-amount');
  const rateInput = document.getElementById('inv-calc-rate');
  const termInput = document.getElementById('inv-calc-term');

  const amount = parseFloat(amountInput.value) || 0;
  const rate = parseFloat(rateInput.value) || 0;
  const term = parseInt(termInput.value) || 0;

  // Fórmula estándar del sector financiero base 360 días:
  // Rendimiento = Monto * (Tasa / 100) * (Plazo / 360)
  const yieldAmount = amount * (rate / 100) * (term / 360);
  const totalAmount = amount + yieldAmount;

  // Actualizar la tarjeta de detalles
  document.getElementById('inv-res-rate').textContent = `${rate.toFixed(2)}%`;
  document.getElementById('inv-res-term').textContent = `${term} Días`;
  document.getElementById('inv-res-yield').textContent = `$${yieldAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  document.getElementById('inv-res-total').textContent = `$${totalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Alterna la visibilidad de un submenú en el sidebar.
 * @param {Event} event - El evento de clic
 * @param {string} submenuId - ID del contenedor del submenú
 */
function toggleSubmenu(event, submenuId) {
  event.preventDefault();
  const menuItem = event.currentTarget;
  const submenu = document.getElementById(submenuId);

  if (submenu) {
    menuItem.classList.toggle('expanded');
    submenu.classList.toggle('collapsed');
  }
}

/**
 * Maneja el clic en una tarjeta de cuenta/depósito para mostrar sus detalles.
 * Evita la acción si se hace clic en botones interactivos dentro de la tarjeta (como ocultar saldo o vencimiento).
 */
function handleCardClick(event, cardElement) {
  // Evitar navegación si se hace clic en botones internos
  if (event.target.closest('.toggle-balance-btn') || event.target.closest('.expiry-label')) {
    return;
  }
  showAccountDetails(cardElement);
}

/**
 * Muestra la vista detallada de una cuenta seleccionada (Saldos y Movimientos).
 */
function showAccountDetails(cardElement) {
  const cardTitle = cardElement.querySelector('.card-title-group h3').textContent;
  const cardNumber = cardElement.querySelector('.account-number').textContent;
  const balanceValElement = cardElement.querySelector('.balance-value');

  // Si el saldo está oculto en el dashboard, también se muestra oculto en la vista de detalle
  const isHidden = balanceValElement.textContent === '$**.**';
  const balanceValue = isHidden ? '$**.**' : balanceValElement.getAttribute('data-value');

  // Formatear el título y valores en la pantalla de detalle
  document.getElementById('detail-card-title').textContent = `${cardTitle.toUpperCase()} — ${cardNumber}`;
  document.getElementById('detail-card-balance-val').textContent = balanceValue;
  document.getElementById('detail-card-total-val').textContent = balanceValue;

  // Llenar movimientos de forma simulada
  const movementsList = document.getElementById('detail-movements-list');
  if (cardTitle.toLowerCase().includes('ahorros')) {
    // movementsList.innerHTML = `
    //   <div class="movimiento-item">
    //     <div class="movimiento-left">
    //       <span class="movimiento-desc">Pago de Spi</span>
    //       <span class="movimiento-date">30 jun. 2026 - 13:44</span>
    //     </div>
    //     <div class="movimiento-right">
    //       <span class="movimiento-amount text-green">+$1,500.00</span>
    //       <span class="movimiento-balance">${isHidden ? '$**.**' : '$20,468.32'}</span>
    //     </div>
    //   </div>
    //   <div class="movimiento-item">
    //     <div class="movimiento-left">
    //       <span class="movimiento-desc">Pago de Judicatura</span>
    //       <span class="movimiento-date">30 jun. 2026 - 16:04</span>
    //     </div>
    //     <div class="movimiento-right">
    //       <span class="movimiento-amount text-red">-$50.05</span>
    //       <span class="movimiento-balance">${isHidden ? '$**.**' : '$18,968.32'}</span>
    //     </div>
    //   </div>
    //   <div class="movimiento-item">
    //     <div class="movimiento-left">
    //       <span class="movimiento-desc">Pago de Judicatura</span>
    //       <span class="movimiento-date">30 jun. 2026 - 16:04</span>
    //     </div>
    //     <div class="movimiento-right">
    //       <span class="movimiento-amount text-red">-$0.35</span>
    //       <span class="movimiento-balance">${isHidden ? '$**.**' : '$19,018.37'}</span>
    //     </div>
    //   </div>
    // `;
  } else {
    // Para depósitos a plazo
    // movementsList.innerHTML = `
    //   <div class="movimiento-item">
    //     <div class="movimiento-left">
    //       <span class="movimiento-desc">Constitución de Inversión</span>
    //       <span class="movimiento-date">01 jul. 2026 - 10:15</span>
    //     </div>
    //     <div class="movimiento-right">
    //       <span class="movimiento-amount text-green">+${balanceValue}</span>
    //       <span class="movimiento-balance">${balanceValue}</span>
    //     </div>
    //   </div>
    // `;
  }

  // Transición visual
  resetAllActiveViewsAndMenu();
  document.getElementById('savings-detail-content').classList.remove('hidden');
}

/**
 * Oculta todas las vistas principales y elimina las clases activas del menú lateral.
 */
function resetAllActiveViewsAndMenu() {
  const views = [
    'dashboard-main-content',
    'savings-detail-content',
    'enviar-cuenta-content',
    'pagar-content',
    'enviar-exterior-content',
    'enviar-celular-content',
    'enviar-regalo-content',
    'invertir-content',
    'enviar-masivo-content',
    'retiro-sin-tarjeta-content'
  ];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('active');
    }
  });

  const menuItems = [
    'menu-item-inicio',
    'menu-item-enviar',
    'submenu-item-a-cuenta',
    'submenu-item-exterior',
    'submenu-item-celular',
    'submenu-item-regalo',
    'menu-item-pagar',
    'menu-item-invertir',
    'submenu-item-masivo',
    'submenu-item-retiro'
  ];
  menuItems.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
    }
  });
}

/**
 * Regresa a la vista principal del dashboard.
 */
function backToDashboard(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();
  
  const dashboard = document.getElementById('dashboard-main-content');
  if (dashboard) {
    dashboard.classList.remove('hidden');
    dashboard.classList.add('active');
  }

  const inicioMenu = document.getElementById('menu-item-inicio');
  if (inicioMenu) inicioMenu.classList.add('active');
}

/**
 * Lleva al usuario a la pantalla de registro
 */
function goToRegister(event) {
  if (event) event.preventDefault();
  
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  
  loginView.classList.remove('active');
  loginView.classList.add('hidden');
  
  registerView.classList.remove('hidden');
  registerView.classList.add('active');
  
  // Limpiar campos del formulario
  document.getElementById('reg-id-type').value = '';
  document.getElementById('reg-id-number').value = '';
  document.getElementById('reg-terms-check').checked = false;
  
  // Deshabilitar botón
  document.getElementById('btn-register-submit').setAttribute('disabled', 'true');
}

/**
 * Regresa a la pantalla de login desde la de registro
 */
function backToLogin(event) {
  if (event) event.preventDefault();
  
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  
  registerView.classList.remove('active');
  registerView.classList.add('hidden');
  
  loginView.classList.remove('hidden');
  loginView.classList.add('active');
  
  // Restablecer el login al paso 1 por seguridad
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('btn-continue').setAttribute('disabled', 'true');
  document.getElementById('btn-login').setAttribute('disabled', 'true');
  
  document.getElementById('login-step-username').classList.remove('hidden');
  document.getElementById('login-step-password').classList.add('hidden');
  clearLoginError();
}

/**
 * Valida el formulario de registro para activar/desactivar el botón Siguiente
 */
function validateRegisterForm() {
  const idType = document.getElementById('reg-id-type').value;
  const idNumber = document.getElementById('reg-id-number').value.trim();
  const termsChecked = document.getElementById('reg-terms-check').checked;
  const btnSubmit = document.getElementById('btn-register-submit');
  
  if (idType && idNumber.length > 0 && termsChecked) {
    btnSubmit.removeAttribute('disabled');
  } else {
    btnSubmit.setAttribute('disabled', 'true');
  }
}

/**
 * Lleva al usuario a la vista "A una cuenta" desde el menú lateral
 */
function goToEnviarCuenta(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const enviarCuenta = document.getElementById('enviar-cuenta-content');
  if (enviarCuenta) {
    enviarCuenta.classList.remove('hidden');
    enviarCuenta.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const aCuentaSub = document.getElementById('submenu-item-a-cuenta');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (aCuentaSub) aCuentaSub.classList.add('active');
}

/**
 * Cambia la selección de banco entre Pacífico y Locales
 */
function selectBank(bankType) {
  const tabPacifico = document.getElementById('tab-pacifico');
  const tabLocales = document.getElementById('tab-locales');

  if (!tabPacifico || !tabLocales) return;

  if (bankType === 'pacifico') {
    tabPacifico.classList.add('active');
    tabPacifico.classList.remove('inactive');
    tabLocales.classList.remove('active');
    tabLocales.classList.add('inactive');
  } else {
    tabLocales.classList.add('active');
    tabLocales.classList.remove('inactive');
    tabPacifico.classList.remove('active');
    tabPacifico.classList.add('inactive');
  }
}

/**
 * Lleva al usuario a la vista "Pagar" desde el menú lateral
 */
function goToPagar(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const pagarView = document.getElementById('pagar-content');
  if (pagarView) {
    pagarView.classList.remove('hidden');
    pagarView.classList.add('active');
  }

  // Limpiar buscador al abrir la vista
  const searchInput = document.getElementById('pagar-search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  filterPagarServices();

  const pagarMenu = document.getElementById('menu-item-pagar');
  if (pagarMenu) pagarMenu.classList.add('active');
}

/**
 * Filtra los servicios de la grilla según lo que el usuario escriba
 */
function filterPagarServices() {
  const query = document.getElementById('pagar-search-input').value.toLowerCase().trim();
  const items = document.querySelectorAll('#pay-services-list .pay-service-item');

  items.forEach(item => {
    const serviceName = item.getAttribute('data-name').toLowerCase();
    if (serviceName.includes(query)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

/**
 * Lleva al usuario a la vista "A una cuenta del exterior" desde el menú lateral
 */
function goToEnviarExterior(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const enviarExterior = document.getElementById('enviar-exterior-content');
  if (enviarExterior) {
    enviarExterior.classList.remove('hidden');
    enviarExterior.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const exteriorSub = document.getElementById('submenu-item-exterior');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (exteriorSub) exteriorSub.classList.add('active');
}

/**
 * Lleva al usuario a la vista "Envío por celular" desde el menú lateral
 */
function goToEnviarCelular(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const enviarCelular = document.getElementById('enviar-celular-content');
  if (enviarCelular) {
    enviarCelular.classList.remove('hidden');
    enviarCelular.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const celularSub = document.getElementById('submenu-item-celular');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (celularSub) celularSub.classList.add('active');
}

/**
 * Lleva al usuario a la vista "Envío de regalo" desde el menú lateral
 */
function goToEnviarRegalo(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const enviarRegalo = document.getElementById('enviar-regalo-content');
  if (enviarRegalo) {
    enviarRegalo.classList.remove('hidden');
    enviarRegalo.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const regaloSub = document.getElementById('submenu-item-regalo');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (regaloSub) regaloSub.classList.add('active');
}

// ==========================================================================
// SECCIÓN DE INVERSIÓN (Calcula tu inversión)
// ==========================================================================

let currentTermType = 'dias';

/**
 * Lleva al usuario a la vista "Invertir" desde el menú lateral.
 */
function goToInvertir(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const invertirView = document.getElementById('invertir-content');
  if (invertirView) {
    invertirView.classList.remove('hidden');
    invertirView.classList.add('active');
  }

  const invertirMenu = document.getElementById('menu-item-invertir');
  if (invertirMenu) invertirMenu.classList.add('active');

  // Inicializar listeners del input de monto si no están inicializados
  initInvertirListeners();
}

/**
 * Cambia el tipo de plazo (Días o Meses) y ajusta los límites e información correspondiente.
 */
function setTermType(type) {
  currentTermType = type;
  const tabDias = document.getElementById('tab-term-dias');
  const tabMeses = document.getElementById('tab-term-meses');
  const durationInput = document.getElementById('inv-duration-input');
  const minPermanenciaMsg = document.getElementById('inv-min-permanencia-msg');
  const millasAlertMsg = document.querySelector('#inv-millas-alert-box span');

  if (!tabDias || !tabMeses || !durationInput || !minPermanenciaMsg || !millasAlertMsg) return;

  if (type === 'dias') {
    tabDias.classList.add('active');
    tabMeses.classList.remove('active');
    
    durationInput.min = 30;
    durationInput.max = 360;
    durationInput.value = 30;
    minPermanenciaMsg.textContent = 'Permanencia mínima es de 30 días hasta 360 días';
    millasAlertMsg.textContent = 'Ganas millas por invertir a partir de 120 días plazo.';
  } else {
    tabMeses.classList.add('active');
    tabDias.classList.remove('active');
    
    durationInput.min = 1;
    durationInput.max = 12;
    durationInput.value = 1;
    minPermanenciaMsg.textContent = 'Permanencia mínima es de 1 mes hasta 12 meses';
    millasAlertMsg.textContent = 'Ganas millas por invertir a partir de 4 meses plazo.';
  }
}

/**
 * Alterna la forma de pago de intereses (Vencimiento / Mensual).
 */
function toggleInterestPayout() {
  const payoutVal = document.getElementById('inv-interest-payout-val');
  if (payoutVal) {
    if (payoutVal.textContent === 'Vencimiento') {
      payoutVal.textContent = 'Mensual';
    } else {
      payoutVal.textContent = 'Vencimiento';
    }
  }
}

/**
 * Inicializa los controladores/listeners del simulador de inversión.
 */
let invertirListenersInitialized = false;
function initInvertirListeners() {
  if (invertirListenersInitialized) return;

  const amountInput = document.getElementById('inv-amount-input');
  if (amountInput) {
    amountInput.addEventListener('focus', function() {
      // Limpiar formato para edición
      let val = amountInput.value.replace(/[$,]/g, '');
      if (parseFloat(val) === 0 || val === '0.00') {
        amountInput.value = '';
      } else {
        amountInput.value = val;
      }
    });

    amountInput.addEventListener('blur', function() {
      // Re-aplicar formato de moneda al salir
      let val = amountInput.value.replace(/[^0-9.]/g, '');
      let num = parseFloat(val);
      if (isNaN(num) || num <= 0) num = 10000; // default value
      amountInput.value = '$' + num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });

    amountInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        amountInput.blur();
      }
    });
  }
  invertirListenersInitialized = true;
}

/**
 * Procesa la simulación y abre el modal de detalles con los resultados calculados.
 */
function handleInvertirSubmit() {
  const amountInput = document.getElementById('inv-amount-input');
  const durationInput = document.getElementById('inv-duration-input');
  
  if (!amountInput || !durationInput) return;

  // Limpiar monto y parsear
  const rawAmount = amountInput.value.replace(/[$,]/g, '');
  const amount = parseFloat(rawAmount) || 10000;
  
  // Validar monto mínimo
  if (amount < 100) {
    alert('El monto mínimo para constituir una inversión es de $100.00');
    amountInput.value = '$100.00';
    return;
  }

  // Parsear duración
  const duration = parseInt(durationInput.value) || 30;

  // Validar rangos de duración
  if (currentTermType === 'dias') {
    if (duration < 30 || duration > 360) {
      alert('La duración en días debe estar entre 30 y 360 días.');
      durationInput.value = Math.max(30, Math.min(360, duration));
      return;
    }
  } else {
    if (duration < 1 || duration > 12) {
      alert('La duración en meses debe estar entre 1 y 12 meses.');
      durationInput.value = Math.max(1, Math.min(12, duration));
      return;
    }
  }

  // Determinar tasa de interés en base al plazo
  let termInDays = duration;
  if (currentTermType === 'meses') {
    termInDays = duration * 30;
  }

  let rate = 4.5;
  if (termInDays >= 360) {
    rate = 5.5;
  } else if (termInDays >= 270) {
    rate = 5.25;
  } else if (termInDays >= 180) {
    rate = 5.0;
  } else if (termInDays >= 90) {
    rate = 4.75;
  }

  // Rellenar campos del modal de cálculo existente
  const calcAmount = document.getElementById('inv-calc-amount');
  const calcRate = document.getElementById('inv-calc-rate');
  const calcTerm = document.getElementById('inv-calc-term');

  if (calcAmount && calcRate && calcTerm) {
    calcAmount.value = amount;
    calcRate.value = rate;
    calcTerm.value = termInDays;
    
    // Ejecutar el cálculo
    calculateInvestment();
    
    // Mostrar modal
    const modal = document.getElementById('investment-modal');
    if (modal) modal.classList.remove('hidden');
  }
}

// ==========================================================================
// SECCIÓN DE ENVÍO MASIVO
// ==========================================================================

let masivoTotalAmount = 0;

/**
 * Lleva al usuario a la vista "Envío Masivo" desde el menú lateral.
 */
function goToEnviarMasivo(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const masivoView = document.getElementById('enviar-masivo-content');
  if (masivoView) {
    masivoView.classList.remove('hidden');
    masivoView.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const masivoSub = document.getElementById('submenu-item-masivo');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (masivoSub) masivoSub.classList.add('active');

  // Inicializar al Paso 1
  resetMasivoWizard();
}

/**
 * Restablece el asistente de Envío Masivo al Paso 1.
 */
function resetMasivoWizard() {
  // Stepper
  document.getElementById('masivo-step-1-indicator').classList.add('active');
  document.getElementById('masivo-step-2-indicator').classList.remove('active');
  document.getElementById('masivo-step-3-indicator').classList.remove('active');

  // Containers
  document.getElementById('masivo-step-1').classList.remove('hidden');
  document.getElementById('masivo-step-2').classList.add('hidden');
  document.getElementById('masivo-step-3').classList.add('hidden');

  // Inputs
  const select = document.getElementById('masivo-origin-account');
  if (select) select.selectedIndex = 0;

  const refInput = document.getElementById('masivo-reference');
  if (refInput) refInput.value = '';

  const checkAll = document.getElementById('masivo-check-all');
  if (checkAll) checkAll.checked = false;

  // Destinos
  const checkboxes = document.querySelectorAll('.masivo-row-check');
  checkboxes.forEach(chk => {
    chk.checked = false;
  });

  const inputs = document.querySelectorAll('.masivo-valor-input');
  inputs.forEach(input => {
    input.value = '';
    input.disabled = true;
  });

  // Botón Siguiente
  const btnNext = document.getElementById('btn-masivo-next');
  if (btnNext) btnNext.disabled = true;
}

/**
 * Activa o desactiva el input de monto de una fila cuando se hace clic en su checkbox.
 */
function toggleMasivoRow(index) {
  const checkbox = document.querySelector(`.masivo-row-check[data-index="${index}"]`);
  const input = document.getElementById(`masivo-val-${index}`);

  if (!checkbox || !input) return;

  if (checkbox.checked) {
    input.disabled = false;
    input.value = '';
    input.focus();
  } else {
    input.value = '';
    input.disabled = true;
  }
  
  // Actualizar check-all si corresponde
  updateMasivoCheckAllState();
  validateMasivoForm();
}

/**
 * Activa o desactiva todas las filas según el checkbox cabecera.
 */
function toggleAllMasivoDestinations(headerCheckbox) {
  const checkboxes = document.querySelectorAll('.masivo-row-check');
  checkboxes.forEach(chk => {
    chk.checked = headerCheckbox.checked;
    const index = chk.getAttribute('data-index');
    const input = document.getElementById(`masivo-val-${index}`);
    if (input) {
      if (headerCheckbox.checked) {
        input.disabled = false;
      } else {
        input.value = '';
        input.disabled = true;
      }
    }
  });

  validateMasivoForm();
}

/**
 * Sincroniza el estado del checkbox cabecera si se marcan todos manualmente.
 */
function updateMasivoCheckAllState() {
  const checkboxes = document.querySelectorAll('.masivo-row-check');
  const checkAll = document.getElementById('masivo-check-all');
  if (!checkAll || checkboxes.length === 0) return;

  const allChecked = Array.from(checkboxes).every(chk => chk.checked);
  checkAll.checked = allChecked;
}

/**
 * Limpia el formato de moneda para facilitar la edición.
 */
function clearInputFormat(input) {
  let val = input.value.replace(/[$,]/g, '');
  if (parseFloat(val) === 0) {
    input.value = '';
  } else {
    input.value = val;
  }
}

/**
 * Aplica formato de moneda al salir del campo.
 */
function formatInputFormat(input) {
  let val = input.value.replace(/[^0-9.]/g, '');
  let num = parseFloat(val);
  if (isNaN(num) || num <= 0) {
    input.value = '';
  } else {
    input.value = '$' + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

/**
 * Valida que los campos requeridos y al menos una cuenta de destino tengan valores correctos.
 */
function validateMasivoForm() {
  const select = document.getElementById('masivo-origin-account');
  const refInput = document.getElementById('masivo-reference');
  const btnNext = document.getElementById('btn-masivo-next');

  if (!select || !refInput || !btnNext) return;

  const isOriginSelected = select.value !== '';
  const isReferenceEntered = refInput.value.trim().length > 0;

  // Verificar destinos seleccionados con valor válido
  const checkboxes = document.querySelectorAll('.masivo-row-check');
  let hasValidDestination = false;

  checkboxes.forEach(chk => {
    if (chk.checked) {
      const index = chk.getAttribute('data-index');
      const input = document.getElementById(`masivo-val-${index}`);
      if (input && input.value !== '') {
        const amount = parseFloat(input.value.replace(/[$,]/g, ''));
        if (!isNaN(amount) && amount > 0) {
          hasValidDestination = true;
        }
      }
    }
  });

  if (isOriginSelected && isReferenceEntered && hasValidDestination) {
    btnNext.disabled = false;
  } else {
    btnNext.disabled = true;
  }
}

/**
 * Pasa al Paso 2 (Confirmación), calculando el total y resumiendo las cuentas a transferir.
 */
function goMasivoToStep2() {
  // Cambiar stepper
  document.getElementById('masivo-step-1-indicator').classList.remove('active');
  document.getElementById('masivo-step-2-indicator').classList.add('active');

  // Alternar pantallas
  document.getElementById('masivo-step-1').classList.add('hidden');
  document.getElementById('masivo-step-2').classList.remove('hidden');

  // Llenar datos de confirmación
  const refValue = document.getElementById('masivo-reference').value;
  document.getElementById('confirm-ref-val').textContent = refValue;

  const confirmBody = document.getElementById('masivo-confirm-body');
  confirmBody.innerHTML = '';

  let totalSum = 0;
  const checkboxes = document.querySelectorAll('.masivo-row-check');

  checkboxes.forEach(chk => {
    if (chk.checked) {
      const index = chk.getAttribute('data-index');
      const row = chk.closest('tr');
      const accDesc = row.querySelector('.masivo-acc-desc').textContent;
      const accOwner = row.querySelector('.masivo-acc-owner').textContent;
      const input = document.getElementById(`masivo-val-${index}`);
      const rawAmount = input.value.replace(/[$,]/g, '');
      const amount = parseFloat(rawAmount) || 0;

      totalSum += amount;

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><span class="masivo-acc-desc">${accDesc}</span></td>
        <td><span class="masivo-acc-owner">${accOwner}</span></td>
        <td style="text-align: right; font-weight: 700;">$${amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td>
      `;
      confirmBody.appendChild(newRow);
    }
  });

  masivoTotalAmount = totalSum;
  document.getElementById('confirm-total-val').textContent = '$' + totalSum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Regresa del Paso 2 al Paso 1.
 */
function goMasivoBackToStep1() {
  document.getElementById('masivo-step-2-indicator').classList.remove('active');
  document.getElementById('masivo-step-1-indicator').classList.add('active');

  document.getElementById('masivo-step-2').classList.add('hidden');
  document.getElementById('masivo-step-1').classList.remove('hidden');
}

/**
 * Confirma la transferencia debitando de la cuenta del originador y pasando al Paso 3 (Resumen).
 */
function goMasivoToStep3() {
  // Obtener saldo actual
  const savingsBalanceEl = document.getElementById('savings-balance');
  if (!savingsBalanceEl) return;

  const rawBalance = savingsBalanceEl.getAttribute('data-value').replace(/[$,]/g, '');
  const currentBalance = parseFloat(rawBalance) || 0;

  if (masivoTotalAmount > currentBalance) {
    alert('Saldo insuficiente en la cuenta de ahorros de origen.');
    return;
  }

  // Descontar saldo
  const newBalance = currentBalance - masivoTotalAmount;
  savingsBalanceEl.setAttribute('data-value', '$' + newBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }));

  // Si los saldos no están ocultos en el dashboard, actualizar visualmente
  if (savingsBalanceEl.textContent !== '$**.**') {
    savingsBalanceEl.textContent = '$' + newBalance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Registrar movimiento en el historial si es necesario (el dashboard se refresca dinámicamente)
  // Actualizar stepper
  document.getElementById('masivo-step-2-indicator').classList.remove('active');
  document.getElementById('masivo-step-3-indicator').classList.add('active');

  // Alternar pantallas
  document.getElementById('masivo-step-2').classList.add('hidden');
  document.getElementById('masivo-step-3').classList.remove('hidden');

  // Llenar recibo
  const refValue = document.getElementById('masivo-reference').value;
  document.getElementById('receipt-ref-val').textContent = refValue;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('receipt-date-val').textContent = dateStr;

  document.getElementById('receipt-total-val').textContent = '$' + masivoTotalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Cierra la transacción y regresa a la pantalla principal del dashboard.
 */
function finishMasivoTransaction() {
  backToDashboard();
}

// ==========================================================================
// SECCIÓN DE RETIRO SIN TARJETA
// ==========================================================================

/**
 * Lleva al usuario a la vista "Retiro sin tarjeta" desde el menú lateral.
 */
function goToRetiroSinTarjeta(event) {
  if (event) event.preventDefault();
  resetAllActiveViewsAndMenu();

  const retiroView = document.getElementById('retiro-sin-tarjeta-content');
  if (retiroView) {
    retiroView.classList.remove('hidden');
    retiroView.classList.add('active');
  }

  const enviarMenu = document.getElementById('menu-item-enviar');
  const retiroSub = document.getElementById('submenu-item-retiro');

  if (enviarMenu) enviarMenu.classList.add('active');
  if (retiroSub) retiroSub.classList.add('active');
}

/**
 * Simulación al hacer clic en el historial de retiros sin tarjeta.
 */
function showRetiroHistory(event) {
  if (event) event.stopPropagation();
  alert('Historial de Retiros sin Tarjeta:\nNo se registran retiros previos en los últimos 30 días.');
}

/**
 * Simulación al cambiar la cuenta de origen.
 */
function selectRetiroOriginAccount(event) {
  if (event) event.stopPropagation();
  alert('Selección de Cuenta de Origen:\nActualmente está utilizando la única cuenta autorizada para retiros sin tarjeta.');
}

/**
 * Simulación al elegir el celular de destino.
 */
function selectRetiroDestinationCellular(event) {
  if (event) event.stopPropagation();
  alert('Seleccione un celular registrado en sus contactos de confianza.');
}

/**
 * Simulación para enviar el retiro a un celular no registrado.
 */
function sendRetiroUnregistered(event) {
  if (event) event.stopPropagation();
  const phone = prompt('Ingrese el número de celular de destino (10 dígitos):');
  if (phone === null) return; // cancelado
  
  if (phone.trim().length !== 10 || isNaN(phone)) {
    alert('Por favor, ingrese un número de celular válido de 10 dígitos.');
    return;
  }

  const amountStr = prompt('Ingrese el monto a retirar (múltiplos de $10, máximo $100):');
  if (amountStr === null) return; // cancelado

  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount <= 0 || amount > 100 || amount % 10 !== 0) {
    alert('Monto inválido. Debe ingresar un valor múltiplo de $10 y hasta un máximo de $100.00.');
    return;
  }

  // Confirmar y simular descuento
  const confirmTransfer = confirm(`¿Confirma el Retiro sin Tarjeta?\n\nMonto: $${amount.toFixed(2)}\nCelular Destino: ${phone}`);
  if (confirmTransfer) {
    // Obtener saldo
    const balanceEl = document.getElementById('savings-balance');
    if (balanceEl) {
      const rawBalance = balanceEl.getAttribute('data-value').replace(/[$,]/g, '');
      const currentBalance = parseFloat(rawBalance) || 0;

      if (amount > currentBalance) {
        alert('Saldo insuficiente en la cuenta de origen.');
        return;
      }

      const newBalance = currentBalance - amount;
      balanceEl.setAttribute('data-value', '$' + newBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }));

      if (balanceEl.textContent !== '$**.**') {
        balanceEl.textContent = '$' + newBalance.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    }

    alert(`¡Solicitud de Retiro Creada!\nSe ha enviado un código de seguridad OTP de 6 dígitos mediante SMS al número ${phone} para efectuar el retiro en cualquier cajero automático del Banco del Pacífico.`);
    backToDashboard();
  }
}

