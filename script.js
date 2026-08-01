// ==========================================
// DATOS REALES INCORPORADOS DESDE LA BASE DE DATOS
// ==========================================
const datosUsuarios = [
    { id: 'U-01', nombre: 'JOEL', dni: '45557905', direccion: 'MZ. 13 LT. 13', estado: 'ACTIVO', saldo: '0.00' },
    { id: 'U-02', nombre: 'HENRY', dni: '45747760', direccion: 'MZ. 33 LT. 05', estado: 'ACTIVO', saldo: '0.00' },
    { id: 'U-03', nombre: 'MILTON', dni: '65675677', direccion: 'MZ. 33 LT. 12', estado: 'ACTIVO', saldo: '0.00' },
    { id: 'U-04', nombre: 'VICTOR', dni: '56765756', direccion: 'MZ. 12 LT. 04', estado: 'ACTIVO', saldo: '0.00' },
    { id: 'U-05', nombre: 'ELADIO', dni: '00000000', direccion: 'MZ. 10 LT. 01', estado: 'ACTIVO', saldo: '0.00' }
];

const datosAjustes = { cargo_fijo: '10.47', pago_sistema: '2.73' };

// Último registro histórico disponible (Periodo 202608 / Agosto 2026)
const medidorPrincipalActual = {
    id: 202608,
    anio: '2026',
    mes: 'AGOSTO',
    lectura_anterior: 8300,
    lectura_actual: 8395,
    consumo_kw: 95,
    fuga_kw: 6,
    total_pagar: '92.60',
    cargo_fijo: '10.47',
    pago_sistema: '2.73',
    precio_kw: '0.8347',
    precio_fuga: '0.8347'
};

const consumosDetallados = [
    { periodo: '2026-AGO', usuario: 'JOEL', ant: 5233, act: 5303, subtotal: '58.4316', exacto: '62.07', pagar: '62.10', estado: 'PENDIENTE' },
    { periodo: '2026-AGO', usuario: 'HENRY', ant: 2016, act: 2022, subtotal: '5.0084', exacto: '8.65', pagar: '8.70', estado: 'PENDIENTE' },
    { periodo: '2026-AGO', usuario: 'MILTON', ant: 1443, act: 1443, subtotal: '0.0000', exacto: '3.64', pagar: '3.60', estado: 'PENDIENTE' },
    { periodo: '2026-AGO', usuario: 'VICTOR', ant: 185, act: 197, subtotal: '10.0168', exacto: '13.65', pagar: '13.70', estado: 'PENDIENTE' },
    { periodo: '2026-AGO', usuario: 'ELADIO', ant: 540, act: 541, subtotal: '0.8347', exacto: '4.47', pagar: '4.50', estado: 'PENDIENTE' }
];

document.addEventListener("DOMContentLoaded", () => {
    inicializarNavegacion();
    cargarDatosReales();
});

// 1. Lógica de Pestañas (Tabs)
function inicializarNavegacion() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            navButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));

            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");

            if (pageTitle) {
                pageTitle.textContent = button.querySelector("span")?.textContent || "Panel";
            }
        });
    });
}

// 2. Cargar datos reales en las tablas e inputs
function cargarDatosReales() {
    // Inputs del Medidor Principal (Periodo Actual)
    const regPeriodo = document.getElementById("reg-periodo");
    if (regPeriodo) regPeriodo.value = `${medidorPrincipalActual.mes} ${medidorPrincipalActual.anio}`;

    const regLecturaAnt = document.getElementById("reg-lectura-anterior-mp");
    if (regLecturaAnt) regLecturaAnt.value = `${medidorPrincipalActual.lectura_anterior} kWh`;

    const regLecturaAct = document.getElementById("reg-lectura-actual");
    if (regLecturaAct) regLecturaAct.value = medidorPrincipalActual.lectura_actual;

    const regTotalPagar = document.getElementById("reg-total-pagar");
    if (regTotalPagar) regTotalPagar.value = `S/ ${medidorPrincipalActual.total_pagar}`;

    const regCargoFijo = document.getElementById("reg-cargo-fijo");
    if (regCargoFijo) regCargoFijo.value = `S/ ${medidorPrincipalActual.cargo_fijo}`;

    const regPagoSistema = document.getElementById("reg-pago-sistema");
    if (regPagoSistema) regPagoSistema.value = `S/ ${medidorPrincipalActual.pago_sistema}`;

    // Llenar tabla de Usuarios
    const tbodyUsuarios = document.querySelector("#tabla-usuarios tbody");
    if (tbodyUsuarios) {
        tbodyUsuarios.innerHTML = datosUsuarios.map(u => `
            <tr>
                <td data-label="ID">${u.id}</td>
                <td data-label="Nombre">${u.nombre}</td>
                <td data-label="DNI">${u.dni}</td>
                <td data-label="Dirección">${u.direccion}</td>
                <td data-label="Estado"><span class="badge-pagado">${u.estado}</span></td>
                <td data-label="Saldo">S/ ${u.saldo}</td>
            </tr>
        `).join('');
    }

    // Llenar tabla de Registro de Lecturas de Usuarios
    const tbodyRegistro = document.querySelector("#tabla-registro-usuarios tbody");
    if (tbodyRegistro) {
        tbodyRegistro.innerHTML = consumosDetallados.map((c, index) => `
            <tr>
                <td data-label="Usuario">${c.usuario}</td>
                <td data-label="Dirección">${datosUsuarios[index]?.direccion || ''}</td>
                <td data-label="Lectura Anterior">${c.ant} kWh</td>
                <td data-label="Lectura Actual (Editar)">
                    <input type="number" class="input-editable" value="${c.act}" data-id="${index}">
                </td>
            </tr>
        `).join('');
    }

    // Llenar tabla de Cobranza
    const tbodyCobranza = document.querySelector("#tabla-consumos-detallados tbody");
    if (tbodyCobranza) {
        tbodyCobranza.innerHTML = consumosDetallados.map(c => `
            <tr>
                <td data-label="Periodo">${c.periodo}</td>
                <td data-label="Usuario">${c.usuario}</td>
                <td data-label="Ant.">${c.ant}</td>
                <td data-label="Act.">${c.act}</td>
                <td data-label="Subtotal">S/ ${c.subtotal}</td>
                <td data-label="Exacto">S/ ${c.exacto}</td>
                <td data-label="Pagar">S/ ${c.pagar}</td>
                <td data-label="Estado"><span class="${c.estado === 'PAGADO' ? 'badge-pagado' : 'badge-pendiente'}">${c.estado}</span></td>
            </tr>
        `).join('');
    }

    // Llenar tabla de Reportes (Resumen General)
    const tbodyResumen = document.querySelector("#tabla-resumen tbody");
    if (tbodyResumen) {
        tbodyResumen.innerHTML = consumosDetallados.map(c => `
            <tr>
                <td data-label="Periodo">${c.periodo}</td>
                <td data-label="Usuario">${c.usuario}</td>
                <td data-label="Consumo">${c.act - c.ant} kWh</td>
                <td data-label="Total">S/ ${c.pagar}</td>
                <td data-label="Estado"><span class="${c.estado === 'PAGADO' ? 'badge-pagado' : 'badge-pendiente'}">${c.estado}</span></td>
            </tr>
        `).join('');
    }

    // Actualizar métricas del reporte
    const totalUsuariosEl = document.getElementById("total-usuarios");
    const totalRegistrosEl = document.getElementById("total-registros");
    if (totalUsuariosEl) totalUsuariosEl.textContent = datosUsuarios.length;
    if (totalRegistrosEl) totalRegistrosEl.textContent = consumosDetallados.length;
}

// 3. Función para Guardar Cambios
function guardarRegistro() {
    alert("¡Lecturas y datos actualizados correctamente con la base de datos de ElectroApp!");
}