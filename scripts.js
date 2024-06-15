const BASE_URL = "https://equran.id/api/v2";

const arabicNumbers = (number) => {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  return String(number).replace(/[0-9]/g, (d) => arabicDigits[d]);
};

const quranSurah = async () => {
  const endpoint = `${BASE_URL}/surat`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data.data;
};

const quranDetail = async (nomor) => {
  const endpoint = `${BASE_URL}/surat/${nomor}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data.data;
};

quranSurah().then((surat) => {
  surat.forEach((surah) => {
    const list = `<a href="#" class="list-group-item list-group-item-action" id="surah-${surah.nomor}">
                    <span class="arabic-number">${arabicNumbers(surah.nomor)}</span> - ${surah.namaLatin} (${surah.nama})
                  </a>`;
    document.querySelector("#daftar-surah").insertAdjacentHTML("beforeend", list);

    document.querySelector(`#surah-${surah.nomor}`).addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector(`#text-arabic`).innerHTML = "Loading...";
      quranDetail(surah.nomor).then((ayat) => {
        document.querySelector(`#text-arabic`).innerHTML = "";
        ayat.ayat.forEach((ayah) => {
          const ayatHtml = `<div class="row mt-4">
                                <div class="col-11">
                                    <div class="list-group shadow-sm fs-3 text-end amiri" title="${ayah.teksIndonesia}">
                                        ${ayah.teksArab}
                                    </div>
                                    <div class="list-group shadow-sm fs-5 text-end" style="font-family: 'Roboto', sans-serif;">
                                        ${ayah.teksIndonesia}
                                    </div>
                                </div>
                                <div class="col-1">
                                    <div class="list-group shadow-sm fs-3 text-center arabic-number">
                                        <a href="#" onclick="playAudio('${ayah.audio['01']}')">${arabicNumbers(ayah.nomorAyat)}</a>
                                    </div>
                                </div>
                                <div class="col-12 text-center mt-2">
                                    <button onclick="playAudio('${ayah.audio['01']}')" class="btn btn-success">Play Audio</button>
                                </div>
                              </div>`;
          document.querySelector(`#text-arabic`).insertAdjacentHTML("beforeend", ayatHtml);
        });
      }).catch(error => {
        document.querySelector(`#text-arabic`).innerHTML = `Error loading surah: ${error.message}`;
      });
    });
  });
}).catch(error => {
  document.querySelector(`#daftar-surah`).innerHTML = `Error loading surah list: ${error.message}`;
});

function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}
