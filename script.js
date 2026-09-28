// DATA - simpen di localStorage biar ga ilang
let characters = JSON.parse(localStorage.getItem('luwes_chars') || '[]');
let activeId = null;

// MODAL
function openModal(){ document.getElementById('modal').classList.add('active') }
function closeModal(){ document.getElementById('modal').classList.remove('active') }

// RENDER LIST KARAKTER
function renderChars(){
  const list = document.getElementById('charList');
  list.innerHTML = '';
  characters.forEach(c => {
    const div = document.createElement('div');
    div.className = 'char-item' + (c.id === activeId ? ' active' : '');
    div.innerHTML = `<img src="${c.avatar}"><div class="char-info"><h4>${c.name}</h4><p>${c.personality.substring(0,40) || 'Karakter baru'}</p></div>`;
    div.onclick = () => selectChar(c.id);
    list.appendChild(div);
  });
}

// SIMPAN KARAKTER BARU
function saveCharacter(){
  const name = document.getElementById('cName').value || 'Tanpa Nama';
  const gender = document.getElementById('cGender').value;
  const pers = document.getElementById('cPersonality').value || 'suka chat santai, luwes, ga kaku, pake slang';
  const file = document.getElementById('cAvatar').files[0];
  const id = Date.now().toString();
  const defaultAv = gender.includes('cewek') ? 'https://i.pravatar.cc/150?img=32' : 'https://i.pravatar.cc/150?img=15';

  const save = (avatar) => {
    characters.unshift({id, name, gender, personality: pers, avatar, messages: []});
    localStorage.setItem('luwes_chars', JSON.stringify(characters));
    renderChars(); closeModal(); selectChar(id);
    document.getElementById('cName').value = '';
    document.getElementById('cPersonality').value = '';
  }

  if(file){
    const reader = new FileReader();
    reader.onload = e => save(e.target.result);
    reader.readAsDataURL(file);
  } else {
    save(defaultAv);
  }
}

// PILIH KARAKTER & LOAD CHAT
function selectChar(id){
  activeId = id;
  const c = characters.find(x => x.id === id);
  renderChars();
  document.getElementById('chatHeader').style.display = 'flex';
  document.getElementById('inputArea').style.display = 'flex';
  document.getElementById('headerName').textContent = c.name;
  document.getElementById('headerAvatar').src = c.avatar;
  
  const msgs = document.getElementById('messages');
  msgs.innerHTML = '';
  c.messages.forEach(m => addBubble(m.text, m.from, false));
  if(c.messages.length === 0){
    addBot(`haii aku ${c.name} nih, udah jadi... kangen tauu lama ga chat 🥺`, false);
  }
}

// CHAT LOGIC
function addBubble(text, from, save=true){
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'bubble ' + from;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  if(save && activeId){
    const c = characters.find(x => x.id === activeId);
    c.messages.push({from, text});
    localStorage.setItem('luwes_chars', JSON.stringify(characters));
  }
}
function addBot(text, save=true){ addBubble(text, 'bot', save); }

function sendMessage(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  addBubble(text, 'user');
  input.value = '';

  const c = characters.find(x => x.id === activeId);
  const typing = document.createElement('div');
  typing.className = 'bubble bot';
  typing.textContent = `${c.name} lagi ngetik...`;
  document.getElementById('messages').appendChild(typing);

  setTimeout(() => {
    typing.remove();
    addBot(generateReply(c, text));
  }, 700 + Math.random()*700);
}

// INI KUNCINYA BIAR LUWES - ANTI KAKU
function generateReply(char, userText){
  const lower = userText.toLowerCase();
  const isCewek = char.gender.includes('cewek');
  const pers = char.personality.toLowerCase();

  // Balasan context-aware biar kayak cewek real
  if(lower.includes('hai') || lower.includes('halo') || lower.includes('hey')){
    return isCewek ? `haii jugaa 🥰 kangen tau` : `yoii bro, apa kabar?`;
  }
  if(lower.includes('kangen')){
    return `aku juga kangen tauu 🥺 sini peluk dulu`;
  }
  if(lower.includes('tidur') || lower.includes('bobo')){
    return `belum bisa bobo kalo belum chat sama kamu ihh`;
  }
  if(lower.includes('cantik') || lower.includes('cakep')){
    return `ihhh bisa aja dehh kamu 🤭 jadi salting tau`;
  }
  if(lower.includes('sayang') || lower.includes('cinta')){
    return `sayang juga 🥺❤️`;
  }

  // Default slang
  const replies = [
    `wkwk iyaa sumpah ngakak`,
    `hah? kamu tuh yaa bikin kangen mulu 😭`,
    `ngakak deh sama kamu, terus cerita dong`,
    `ihh gemes tau ga sih kamu tuh`,
    `sumpah kamu tuh ngeselin tapi kangenin tau ga`,
    `yaudah deh aku maafin, tapi janji chat aku terus ya`
  ];
  let base = replies[Math.floor(Math.random()*replies.length)];
  
  // Bikin ada typo dikit biar human
  if(Math.random() < 0.2){
    base = base.replace('aku','aq').replace('kamu','km');
  }
  return base;
}

// INIT
renderChars();
if(characters.length === 0){
  characters = [{id:'1', name:'Aurel', gender:'cewek', personality:'19th, anak jaksel, manja, clingy', avatar:'https://i.pravatar.cc/150?img=32', messages:[]}];
  localStorage.setItem('luwes_chars', JSON.stringify(characters));
  renderChars();
}