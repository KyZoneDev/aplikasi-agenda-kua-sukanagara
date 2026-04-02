const appUtils = {
  uuid(){ return 'id-' + Math.random().toString(36).slice(2,9); },
  today(){ const d=new Date(); return d.toISOString().slice(0,10); }
};

const dataStore = {
  _key(k){ return 'kua_' + k; },
  getAll(name){ try{ const raw = localStorage.getItem(this._key(name)); return raw ? JSON.parse(raw) : []; }catch(e){return []}},
  save(name, obj){ const arr = this.getAll(name); arr.push(obj); localStorage.setItem(this._key(name), JSON.stringify(arr)); },
  find(name, id){ return this.getAll(name).find(x => x.id === id); },
  remove(name, id){ const arr = this.getAll(name).filter(x => x.id !== id); localStorage.setItem(this._key(name), JSON.stringify(arr)); }
};

// ==========================
// AUTENTIKASI PEGAWAI
// ==========================
const appAuth = (function(){
  const usersKey = 'kua_users';
  const sessionKey = 'kua_session';

  function getUsers(){ 
    try { return JSON.parse(localStorage.getItem(usersKey)) || []; } 
    catch(e){ return []; } 
  }

  function saveUsers(u){ localStorage.setItem(usersKey, JSON.stringify(u)); }

  return {
    ensureUser(user){
      const u = getUsers();
      if (!u.find(x => x.username === user.username)){
        u.push(user);
        saveUsers(u);
      }
    },
    login(username, password){
      const u = getUsers();
      const found = u.find(x => x.username === username && x.password === password);
      if (found){
        localStorage.setItem(sessionKey, JSON.stringify(found));
        return true;
      }
      return false;
    },
    logout(){
      localStorage.removeItem(sessionKey);
      window.location.href = "login.html";
    },
    currentUser(){
      try{ return JSON.parse(localStorage.getItem(sessionKey)); }
      catch(e){ return null; }
    },
    protectPage(){
      const u = this.currentUser();
      if (!u) {
        window.location.href = "login.html";
      }
    }
  };
})();

// Buat user default pertama kali
(function(){
  const users = JSON.parse(localStorage.getItem('kua_users') || '[]');
  if (!users.length){
    users.push({ username:'admin', password:'admin123', name:'Administrator' });
    users.push({ username:'pegawai1', password:'password123', name:'Pegawai Demo' });
    localStorage.setItem('kua_users', JSON.stringify(users));
  }
})();

// ==========================
// 🌙 SISTEM DARK MODE GLOBAL
// ==========================
(function(){
  const root = document.documentElement;
  const themeKey = 'kua_theme';
  const darkClass = 'dark-mode';

  // Terapkan tema dari localStorage
  if (localStorage.getItem(themeKey) === 'dark') {
    root.classList.add(darkClass);
  }

  // Pasang event listener global
  document.addEventListener('click', (e)=>{
    if (e.target && e.target.id === 'themeToggle') {
      const isDark = root.classList.toggle(darkClass);
      localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
      e.target.textContent = isDark ? '🌞' : '🌙';
    }
  });

  // Saat halaman dibuka, ubah ikon tombol sesuai mode
  document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = root.classList.contains(darkClass) ? '🌞' : '🌙';
  });
})();
