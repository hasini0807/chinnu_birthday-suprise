(()=>{
  const pages = [...document.querySelectorAll('.page')];
  const dots = document.getElementById('dots');
  let index = 0;
  let sound = false;
  let ctx = null;
  let pops = 0;

  const $ = (id) => document.getElementById(id);

  const balloonMessages = [
    'I love you because, I love your childish character that no one knows. And that’s the beauty in you 🧿',
    'I love you because, you love your loved ones to the peak but doesn’t show it 🥺',
    'I love you because, you are my everything 💕',
    'I love you because, I love the way you respect and love your mom. And I know you will treat me the same 🫂'
  ];

  pages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (!i ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to screen ' + (i + 1));
    dot.addEventListener('click', () => go(i));
    dots.appendChild(dot);
  });

  function go(i) {
    index = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach((page, n) => page.classList.toggle('active', n === index));
    [...dots.children].forEach((dot, n) => dot.classList.toggle('active', n === index));
    $('step').textContent = String(index + 1).padStart(2, '0') + ' / 09';
    $('back').disabled = index === 0;
    $('next').disabled = index === pages.length - 1;
    if (index === 8) confetti();
  }

  function toast(t) {
    const el = $('toast');
    el.textContent = t;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2300);
  }

  function tone(f = 600) {
    if (!sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  function confetti() {
    const c = $('confetti');
    c.innerHTML = '';
    for (let i = 0; i < 65; i++) {
      const e = document.createElement('i');
      e.style.setProperty('--x', Math.random() * 100 + '%');
      e.style.setProperty('--h', Math.random() * 360);
      e.style.setProperty('--d', 2.5 + Math.random() * 3 + 's');
      e.style.setProperty('--delay', Math.random() * 2 + 's');
      c.appendChild(e);
    }
  }

  $('launch').addEventListener('click', () => {
    tone(740);
    go(1);
  });

  document.querySelectorAll('[data-next]').forEach((b) => {
    b.addEventListener('click', () => go(index + 1));
  });

  $('back').addEventListener('click', () => go(index - 1));
  $('next').addEventListener('click', () => go(index + 1));

  $('cakeNext').addEventListener('click', () => {
    const c = $('cakeArt');
    c.classList.toggle('grown');
    if (!c.dataset.cut) {
      c.dataset.cut = '1';
      $('cakeHint').textContent = 'A sweet slice for you, my love! 💗';
      $('cakeNext').textContent = 'Now pop the balloons →';
    } else {
      go(4);
    }
    tone(520);
  });

  document.querySelectorAll('[data-balloon]').forEach((balloon) => {
    balloon.addEventListener('click', () => {
      if (balloon.classList.contains('popped')) return;

      balloon.classList.add('popped');
      pops += 1;

      const message = balloonMessages[Number(balloon.dataset.balloon)] || 'You are my forever 💕';
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.textContent = message;
      $('wishList').appendChild(wishItem);

      tone(700 + pops * 80);
      $('balloonNext').disabled = pops < 4;
    });
  });

  $('balloonNext').addEventListener('click', () => go(5));

  document.querySelectorAll('[data-memory]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const memoryIndex = Number(event.target.dataset.memory);
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById('memory' + memoryIndex);
        img.src = e.target.result;
        img.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  });

  const defaultMemoryImages = ['memory1.jpg', 'memory2.jpg'];
  defaultMemoryImages.forEach((src, index) => {
    const img = document.getElementById('memory' + index);
    if (img) {
      img.src = src;
      img.style.display = 'block';
    }
  });

  $('envelope').addEventListener('click', () => {
    const env = $('envelope');
    env.classList.add('open');
    $('letterNext').disabled = false;
    toast('A letter from your love ❤️');
    tone(620);
  });

  $('letterNext').addEventListener('click', () => go(7));

  $('replay').addEventListener('click', () => {
    pops = 0;
    $('wishList').innerHTML = '';
    document.querySelectorAll('.balloon').forEach((b) => b.classList.remove('popped'));
    $('balloonNext').disabled = true;
    $('envelope').classList.remove('open');
    $('letterNext').disabled = true;
    $('cakeArt').classList.remove('grown');
    $('cakeArt').dataset.cut = '';
    $('cakeHint').textContent = 'A little cake for the birthday star.';
    $('cakeNext').textContent = 'Cut the cake 🎂';
    go(0);
  });

  $('sound').addEventListener('click', () => {
    sound = !sound;
    $('sound').textContent = sound ? '♫ Sound on' : '♫ Sound off';
    tone(660);
  });

  go(0);
})();
