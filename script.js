const categoryData = {
    a1: {
      title: "A1 - motocikl do 125ccm",
      image: "./slike/traffic-cone.jpg",
      description: `Motocikli sa ili bez bočne prikolice, radnog obujma motora do 125 cm3 i snage motora od najviše 11 kW i odnosom snage i mase koji ne prelazi 0,1 kW/kg, te  motorna vozila na tri kotača čija snaga nije veća od 15 kW.
Minimalna starosna dob za upis je 15 godina i 6 mjesec, a pristupiti na ispit iz vožnje sa navršenih 16 godina. Kroz obuku prolazi se 30 nastavnih sati iz teorijskog dijela,odslušati predavanje iz Prve pomoći te na kraju u praktičnom dijelu odvoziti 20 sati.
Ukoliko posjedujete B kategoriju u obuci imate 7 sati vožnje, nakon čega se izlazi na ispit iz praktičnog dijela. 
`
    },
    a2: {
      title: "A2 - motocikl do 600ccm",
      image: "./slike/traffic-cone.jpg",
      description: `Motocikli sa ili bez bočne prikolice, čija snaga ne prelazi 35 kW i čiji omjer snaga/masa ne prelazi 0,2 kW/kg, a ne potječu od vozila čija je snaga dvostruko veća i više.
Minimalna starosna dob je 18 godina. Kroz obuku prolazi se 30 nastavnih sati iz teorijskog dijela, predavanje iz Pružanja prve pomoći te 20 sati praktičnog dijela.
Ukoliko već posjedujete B kategoriju, obuka se tada sastoji samo od praktičnog dijela gdje je potrebno odvoziti 15 sati, međutim ako posjedujete A1 kategoriju, praktični dio se sastoji samo od 7 sati.
`
    },
    a: {
      title: "A - motocikl iznad 600ccm",
      image: "./slike/traffic-cone.jpg",
      description: `Motocikli sa ili bez bočne prikolice i motorna vozila na tri kotača čija je snaga veća od 15
kW. Minimalna starosna dob za kategoriju A je 24 godine, odnosno 20 godina ukoliko vozač ima vozačku dozvolu za upravljanje vozilom A2 kategorije najmanje dvije godine.
U program za osposobljavanje moguće se upisati sa 23 godine i 6 mjeseci ili minimalna starosna dob 19 godina i 6 mjeseci, te posjedovanje vozačke dozvole A2 kategorije najmanje 2 godine. Obuku čini 30 nastavnih sati iz teorijskog dijela,Pružanje prve pomoći i 25 sati praktične nastave. Ukoliko se posjeduje B kategorija, potrebno je odvoziti samo 15 sati.
`
    },
    b: {
      title: "B - osobni automobil",
      image: "./slike/traffic-cone.jpg",
      description: `Motorna vozila, osim vozila AM, A1, A2, A, F i G kategorije čija najveća dopuštena masa ne prelazi 3.500 kg i koja su dizajnirana i konstruirana za prijevoz ne više od 8 putnika, ne računajući sjedalo za vozača; motorna vozila ove kategorije mogu biti u kombinaciji s priključnim vozilom čija najveća dopuštena masa ne prelazi 750 kg.
Minimalna starosna dob za upisa B kategorije je 17 godina i 6 mjeseci, međutim kako bi se izašlo na ispit iz Upravljanja vozila potrebno je imati navršenih 18 godina.
Obuka se sastoji od 30 nastavnih sati iz teorijskog dijela i 35 sati praktičnog dijela. Predavanja iz područja Pružanja prve pomoći održavaju ovlaštene zdravstvene ustanove.
`
    }
  };

document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('category-select');
  const info = document.getElementById('category-info');

  if (select && info) {
    select.addEventListener('change', function () {
      const data = categoryData[this.value];
      if (data) {
        info.innerHTML = `
          <div class="category-box">
            <h3>${data.title}</h3>
            <img src="${data.image}" alt="${data.title}">
            <p>${data.description.replace(/\n/g, '<br>')}</p>
          </div>
        `;
        // Smooth scroll to category info
        info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        info.innerHTML = '';
      }
    });
  }
});



