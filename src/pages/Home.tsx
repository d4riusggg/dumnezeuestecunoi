import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

// Baza noastră de versete
const bibleVerses = [
  { text: "„Iată, fecioara va fi însărcinată, va naște un Fiu, și-I vor pune numele Emanuel, care tălmăcit înseamnă: «Dumnezeu este cu noi».”", ref: "Matei 1:23" },
  { text: "„Fiindcă atât de mult a iubit Dumnezeu lumea, că a dat pe singurul Lui Fiu, pentru ca oricine crede în El să nu piară, ci să aibă viața veșnică.”", ref: "Ioan 3:16" },
  { text: "„Pot totul în Hristos care mă întărește.”", ref: "Filipeni 4:13" },
  { text: "„Încrede-te în Domnul din toată inima ta și nu te bizui pe înțelepciunea ta!”", ref: "Proverbe 3:5" },
  { text: "„Căutați mai întâi Împărăția lui Dumnezeu și neprihănirea Lui, și toate aceste lucruri vi se vor da pe deasupra.”", ref: "Matei 6:33" },
  { text: "„Căci Eu știu gândurile pe care le am cu privire la voi”, zice Domnul, „gânduri de pace, și nu de nenorocire, ca să vă dau un viitor și o nădejde.”", ref: "Ieremia 29:11" },
  { text: "„Dumnezeu este adăpostul și sprijinul nostru, un ajutor care nu lipsește niciodată în nevoi.”", ref: "Psalmii 46:1" },
  { text: "„Bucurați-vă întotdeauna în Domnul! Iarăși zic: Bucurați-vă!”", ref: "Filipeni 4:4" },
  { text: "„Frica de Domnul este începutul înțelepciunii; toți cei ce o păzesc au o minte sănătoasă.”", ref: "Psalmii 111:10" },
  { text: "„Tot ce faceți, să faceți din toată inima, ca pentru Domnul, nu ca pentru oameni.”", ref: "Coloseni 3:23" },
  { text: "„Dar roada Duhului este dragostea, bucuria, pacea, îndelunga răbdare, bunătatea, facerea de bine, credincioșia, blândețea, înfrânarea poftelor.”", ref: "Galateni 5:22-23" },
  { text: "„Nu te teme, căci Eu sunt cu tine; nu te uita cu îngrijorare, căci Eu sunt Dumnezeul tău; Eu te întăresc, tot Eu îți vin în ajutor.”", ref: "Isaia 41:10" },
  { text: "„Încredințează-ți soarta în mâna Domnului, și El te va sprijini. El nu va lăsa niciodată să se clatine cel neprihănit.”", ref: "Psalmii 55:22" },
  { text: "„Isus i-a zis: «Eu sunt Calea, Adevărul și Viața. Nimeni nu vine la Tatăl decât prin Mine.»”", ref: "Ioan 14:6" },
  { text: "„Fiindcă plata păcatului este moartea, dar darul fără plată al lui Dumnezeu este viața veșnică în Isus Hristos, Domnul nostru.”", ref: "Romani 6:23" },
  { text: "„Iată, Eu stau la ușă și bat. Dacă aude cineva glasul Meu și deschide ușa, voi intra la el, voi cina cu el, și el cu Mine.”", ref: "Apocalipsa 3:20" },
  { text: "„Nu vă îngrijorați de nimic, ci în orice lucru, aduceți cererile voastre la cunoștința lui Dumnezeu, prin rugăciuni și cereri, cu mulțumiri.”", ref: "Filipeni 4:6" },
  { text: "„Cereți, și vi se va da; căutați și veți găsi; bateți, și vi se va deschide.”", ref: "Matei 7:7" },
  { text: "„Pacea vă las, pacea Mea v-o dau. Nu v-o dau cum o dă lumea. Să nu vi se tulbure inima, nici să nu se înspăimânte.”", ref: "Ioan 14:27" },
  { text: "„Căci, dacă este cineva în Hristos, este o făptură nouă. Cele vechi s-au dus, iată că toate lucrurile s-au făcut noi.”", ref: "2 Corinteni 5:17" },
  { text: "„Binecuvântat să fie omul care se încrede în Domnul și a cărui nădejde este Domnul!”", ref: "Ieremia 17:7" },
  { text: "„Mai mult face un nume bun decât untdelemnul mirositor, și ziua morții decât ziua nașterii.”", ref: "Eclesiastul 7:1" },
  { text: "„Tu îmi dai scutul mântuirii Tale, dreapta Ta mă sprijină și îndurarea Ta mă face mare.”", ref: "Psalmii 18:35" },
  { text: "„Căci prin har ați fost mântuiți, prin credință. Și aceasta nu vine de la voi, ci este darul lui Dumnezeu.”", ref: "Efeseni 2:8" },
  { text: "„Dacă ne mărturisim păcatele, El este credincios și drept ca să ne ierte păcatele și să ne curețe de orice nelegiuire.”", ref: "1 Ioan 1:9" },
  { text: "„Cuvântul Tău este o candelă pentru picioarele mele și o lumină pe cărarea mea.”", ref: "Psalmii 119:105" },
  { text: "„Domnul este Păstorul meu: nu voi duce lipsă de nimic.”", ref: "Psalmii 23:1" },
  { text: "„De aceea vă spun că orice lucru veți cere, când vă rugați, să credeți că l-ați și primit, și-l veți avea.”", ref: "Marcu 11:24" },
  { text: "„Să iubim, dar, pentru că El ne-a iubit întâi.”", ref: "1 Ioan 4:19" },
  { text: "„El vindecă pe cei cu inima zdrobită și le leagă rănile.”", ref: "Psalmii 147:3" },
  { text: "„Fiți buni unii cu alții, miloși, și iertați-vă unul pe altul, cum v-a iertat și Dumnezeu pe voi în Hristos.”", ref: "Efeseni 4:32" },
  { text: "„Orice armă făurită împotriva ta va fi fără putere.”", ref: "Isaia 54:17" },
  { text: "„Cerul și pământul vor trece, dar cuvintele Mele nu vor trece.”", ref: "Matei 24:35" },
  { text: "„În El avem răscumpărarea, prin sângele Lui, iertarea păcatelor, după bogățiile harului Său.”", ref: "Efeseni 1:7" },
  { text: "„Să nu iubiți cu vorba, nici cu limba, ci cu fapta și cu adevărul.”", ref: "1 Ioan 3:18" },
  { text: "„Nu vă potriviți chipului veacului acestuia, ci prefaceți-vă prin înnoirea minții voastre.”", ref: "Romani 12:2" },
  { text: "„Cel ce umblă cu înțelepții se face înțelept, dar tovarășul nebunilor se va face rău.”", ref: "Proverbe 13:20" },
  { text: "„Apropiați-vă de Dumnezeu, și El Se va apropia de voi.”", ref: "Iacov 4:8" },
  { text: "„Să nu te părăsească bunătatea și credincioșia: leagă-ți-le la gât, scrie-le pe tăblița inimii tale.”", ref: "Proverbe 3:3" },
  { text: "„El ne-a mântuit nu pentru faptele făcute de noi în neprihănire, ci pentru îndurarea Lui.”", ref: "Tit 3:5" },
  { text: "„Căci gândurile Mele nu sunt gândurile voastre, și căile voastre nu sunt căile Mele, zice Domnul.”", ref: "Isaia 55:8" },
  { text: "„Să nu obosim în facerea binelui; căci, la vremea potrivită, vom secera, dacă nu vom cădea de oboseală.”", ref: "Galateni 6:9" },
  { text: "„Adu-ți aminte de Făcătorul tău în zilele tinereții tale, până nu vin zilele cele rele.”", ref: "Eclesiastul 12:1" },
  { text: "„Unde este Comoara voastră, acolo va fi și inima voastră.”", ref: "Matei 6:21" },
  { text: "„Domnul să te binecuvânteze și să te păzească! Domnul să facă să lumineze Fața Lui peste tine și să Se îndure de tine!”", ref: "Numeri 6:24-25" },
  { text: "„Iată ce zi a făcut Domnul: să ne bucurăm și să ne veselim în ea!”", ref: "Psalmii 118:24" },
  { text: "„Așadar, frații mei preaiubiți, orice om să fie grabnic la ascultare, încet la vorbire, zăbavnic la mânie.”", ref: "Iacov 1:19" },
  { text: "„Lăudați pe Domnul, căci este bun, căci în veac ține îndurarea Lui!”", ref: "Psalmii 136:1" },
  { text: "„Omul se uită la ceea ce izbește ochii, dar Domnul se uită la inimă.”", ref: "1 Samuel 16:7" },
  { text: "„Fiți dar sfinți, căci Eu sunt sfânt.”", ref: "1 Petru 1:16" },
  { text: "„Căci cine se înalță va fi smerit și cine se smerește va fi înălțat.”", ref: "Matei 23:12" },
  { text: "„Puneți-vă nădejdea în Dumnezeu, căci iarăși Îl voi lăuda: El este mântuirea mea și Dumnezeul meu.”", ref: "Psalmii 42:11" },
  { text: "„Apoi a zis ucenicilor Săi: «Mare este secerișul, dar puțini sunt lucrătorii.»”", ref: "Matei 9:37" },
  { text: "„Să iubești pe aproapele tău ca pe tine însuți. Nu este altă poruncă mai mare decât aceasta.”", ref: "Marcu 12:31" },
  { text: "„Domnul este tăria mea și scutul meu; în El mi se încrede inima, și sunt ajutat.”", ref: "Psalmii 28:7" },
  { text: "„Voi sunteți sarea pământului. Dar dacă sarea își pierde gustul, prin ce își va căpăta iarăși puterea de a săra?”", ref: "Matei 5:13" },
  { text: "„Gustați și vedeți ce bun este Domnul! Ferice de omul care se încrede în El!”", ref: "Psalmii 34:8" },
  { text: "„Totuși eu mă voi bucura în Domnul, mă voi bucura în Dumnezeul mântuirii mele!”", ref: "Habacuc 3:18" },
  { text: "„Pe cel ce vine la Mine, nu-l voi izgoni afară.”", ref: "Ioan 6:37" },
  { text: "„Pentru că toți au păcătuit și sunt lipsiți de slava lui Dumnezeu.”", ref: "Romani 3:23" },
  { text: "„Îmbrăcați-vă cu toată armătura lui Dumnezeu, ca să puteți ținea piept împotriva uneltirilor diavolului.”", ref: "Efeseni 6:11" },
  { text: "„Prețuiește înțelepciunea și ea te va înălța; ea te va slăvi, dacă o vei îmbrățișa.”", ref: "Proverbe 4:8" },
  { text: "„O inimă veselă este un bun leac, dar un duh mâhnit usucă oasele.”", ref: "Proverbe 17:22" },
  { text: "„Nu oricine Îmi zice: «Doamne, Doamne!» va intra în Împărăția cerurilor, ci cel ce face voia Tatălui Meu care este în ceruri.”", ref: "Matei 7:21" },
  { text: "„De aceea, lăsați-vă de minciună: fiecare din voi să spună aproapelui său adevărul.”", ref: "Efeseni 4:25" },
  { text: "„Cei ce se încred în Domnul își înnoiesc puterea, ei zboară ca vulturii.”", ref: "Isaia 40:31" },
  { text: "„Domnul mă va izbăvi de orice lucru rău și mă va mântui, ca să intru în Împărăția Lui cerească.”", ref: "2 Timotei 4:18" },
  { text: "„Să aveți dragoste unii pentru alții, cum v-am iubit Eu.”", ref: "Ioan 15:12" },
  { text: "„Tot ce este adevărat, tot ce este vrednic de cinste... la acestea să vă gândiți.”", ref: "Filipeni 4:8" },
  { text: "„Iubește pe Domnul Dumnezeul tău cu toată inima ta, cu tot sufletul tău și cu tot cugetul tău.”", ref: "Matei 22:37" },
  { text: "„Mântuirea este departe de cei răi, căci ei nu caută orânduirile Tale.”", ref: "Psalmii 119:155" },
  { text: "„Când întorci spatele de la un lucru rău, Domnul îți arată fața Lui.”", ref: "Iov 33:26" },
  { text: "„Ferice de cei săraci în duh, căci a lor este Împărăția cerurilor!”", ref: "Matei 5:3" },
  { text: "„Orice om să se teamă de mama și de tatăl său.”", ref: "Leviticul 19:3" },
  { text: "„Mulțumiri fie aduse lui Dumnezeu pentru darul Lui nespus de mare!”", ref: "2 Corinteni 9:15" },
  { text: "„Rugați-vă neîncetat.”", ref: "1 Tesaloniceni 5:17" },
  { text: "„Căci unde sunt doi sau trei adunați în Numele Meu, sunt și Eu în mijlocul lor.”", ref: "Matei 18:20" },
  { text: "„Harul Domnului nostru Isus Hristos să fie cu voi cu toți! Amin.”", ref: "Romani 16:24" },
  { text: "„Păziți-vă inima mai mult decât orice, căci din ea ies izvoarele vieții.”", ref: "Proverbe 4:23" },
  { text: "„Nu vă lăsați amăgiți: Tovărășiile rele strică obiceiurile bune.”", ref: "1 Corinteni 15:33" },
  { text: "„Dumnezeu este iubire; și cine rămâne în iubire rămâne în Dumnezeu, și Dumnezeu rămâne în el.”", ref: "1 Ioan 4:16" },
  { text: "„Cel ce este încet la mânie prețuiește mai mult decât un viteaz.”", ref: "Proverbe 16:32" },
  { text: "„Fiindcă știm că încercarea credinței voastre lucrează răbdare.”", ref: "Iacov 1:3" },
  { text: "„Căci cu inima se crede spre neprihănire, iar cu gura se face mărturisirea spre mântuire.”", ref: "Romani 10:10" },
  { text: "„Așezați-vă lucrurile la punct, înveseliți-vă, fiți cu un cuget, trăiți în pace.”", ref: "2 Corinteni 13:11" },
  { text: "„Eu sunt Păstorul cel bun. Păstorul cel bun Își dă viața pentru oi.”", ref: "Ioan 10:11" },
  { text: "„Să nu datorați nimănui nimic, decât să vă iubiți unii pe alții.”", ref: "Romani 13:8" },
  { text: "„Dumnezeul nădejdii să vă umple de toată bucuria și pacea pe care o dă credința.”", ref: "Romani 15:13" },
  { text: "„Îmbrăcați-vă cu dragostea, care este legătura desăvârșirii.”", ref: "Coloseni 3:14" },
  { text: "„Urmăriți pacea cu toți și sfințirea, fără de care nimeni nu va vedea pe Domnul.”", ref: "Evrei 12:14" },
  { text: "„El dă tărie celui obosit și mărește puterea celui ce cade în leșin.”", ref: "Isaia 40:29" },
  { text: "„Dacă aduci un dar la altar și acolo îți aduci aminte că fratele tău are ceva împotriva ta, lasă-ți darul acolo, și du-te de te împacă.”", ref: "Matei 5:23-24" },
  { text: "„Nu mă rușinez de Evanghelia lui Hristos, fiindcă ea este puterea lui Dumnezeu pentru mântuirea fiecăruia care crede.”", ref: "Romani 1:16" },
  { text: "„Dar voi sunteți o seminție aleasă, o preoție împărătească, un neam sfânt, un popor pe care Dumnezeu Și l-a câștigat.”", ref: "1 Petru 2:9" },
  { text: "„Toată Scriptura este insuflată de Dumnezeu și de folos ca să învețe, să mustre, să îndrepte.”", ref: "2 Timotei 3:16" },
  { text: "„Slujiți Domnului cu bucurie, veniți cu veselie înaintea Lui.”", ref: "Psalmii 100:2" },
  { text: "„Dar Domnul este cu mine ca un viteaz puternic; de aceea prigonitorii mei se vor poticni.”", ref: "Ieremia 20:11" },
  { text: "„Mântuiește, Doamne, poporul Tău, și binecuvântează moștenirea Ta!”", ref: "Psalmii 28:9" },
  { text: "„El stă pe scaunul Lui de domnie în ceruri, și Își face râs de ei.”", ref: "Psalmii 2:4" },
  { text: "„Îmi ridic ochii spre munți: de unde-mi va veni ajutorul? Ajutorul îmi vine de la Domnul.”", ref: "Psalmii 121:1-2" },
  { text: "„Zidește în mine o inimă curată, Dumnezeule, și pune în mine un duh nou și statornic!”", ref: "Psalmii 51:10" },
  { text: "„Întoarce-te la Mine, căci Eu te-am răscumpărat.”", ref: "Isaia 44:22" },
  { text: "„Iată Mielul lui Dumnezeu, care ridică păcatul lumii!”", ref: "Ioan 1:29" },
  { text: "„Nu prin putere, nici prin tărie, ci prin Duhul Meu, zice Domnul oștirilor!”", ref: "Zaharia 4:6" },
  { text: "„Căci toți suntem copiii lui Dumnezeu prin credința în Hristos Isus.”", ref: "Galateni 3:26" }
];

// LISTA CU IMAGINI PENTRU SLIDESHOW
// Aici vei putea schimba numele pozelor pe măsură ce le adaugi în folderul public
const imaginiSlideshow = [
  "/pastorul.jpg", // Poza 1 (pe care o ai deja)
  "/pastorul2.jpg",
  "/pastorul3.jpg",
];

export default function Home() {
  // Starea pentru a urmări a câta poză este afișată
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efectul care schimbă poza la fiecare 5 secunde (5000 milisecunde)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imaginiSlideshow.length);
    }, 5000); 

    // Curățăm intervalul dacă utilizatorul pleacă de pe pagină
    return () => clearInterval(interval);
  }, []);

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dayIndex = (getDayOfYear() + 1) % bibleVerses.length;
  const verseOfTheDay = bibleVerses[dayIndex];
  
  const getBibleLink = (referinta: string) => {
    const booksMap: Record<string, string> = {
      "Matei": "Mat", "Marcu": "Mar", "Luca": "Luc", "Ioan": "Ioan", "Faptele Apostolilor": "Fap", 
      "Romani": "Rom", "1 Corinteni": "1Cor", "2 Corinteni": "2Cor", "Galateni": "Gal", "Efeseni": "Efes", 
      "Filipeni": "Fil", "Coloseni": "Col", "1 Tesaloniceni": "1Tes", "2 Tesaloniceni": "2Tes", 
      "1 Timotei": "1Tim", "2 Timotei": "2Tim", "Tit": "Tit", "Filimon": "Filim", "Evrei": "Evr", 
      "Iacov": "Iac", "1 Petru": "1Pet", "2 Petru": "2Pet", "1 Ioan": "1Ioan", "2 Ioan": "2Ioan", 
      "3 Ioan": "3Ioan", "Iuda": "Iuda", "Apocalipsa": "Apoc", "Geneza": "Gen", "Exodul": "Ex", 
      "Leviticul": "Lev", "Numeri": "Num", "Deuteronomul": "Deut", "Iosua": "Ios", "Judecători": "Jud", 
      "Rut": "Rut", "1 Samuel": "1Sam", "2 Samuel": "2Sam", "1 Împărați": "1Imp", "2 Împărați": "2Imp", 
      "1 Cronici": "1Cron", "2 Cronici": "2Cron", "Ezra": "Ezra", "Neemia": "Neem", "Estera": "Est", 
      "Iov": "Iov", "Psalmii": "Ps", "Proverbe": "Prov", "Eclesiastul": "Ecl", "Cântarea Cântărilor": "Cant", 
      "Isaia": "Isa", "Ieremia": "Ier", "Plângerile lui Ieremia": "Plang", "Ezechiel": "Ezec", 
      "Daniel": "Dan", "Osea": "Osea", "Ioel": "Ioel", "Amos": "Amos", "Obadia": "Obad", "Iona": "Iona", 
      "Mica": "Mica", "Naum": "Naum", "Habacuc": "Hab", "Țefania": "Tef", "Hagai": "Hag", 
      "Zaharia": "Zah", "Maleahi": "Mal"
    };

    const match = referinta.match(/(.+?)\s+(\d+):(\d+)/);
    if (!match) return "https://ebiblia.ro/"; 
    
    const bookName = match[1].trim();
    const chapter = match[2];
    const verse = match[3];
    const abbrev = booksMap[bookName] || bookName.substring(0, 3);
    return `https://ebiblia.ro/app/index.html?ebiblia#read/vdcc/${abbrev}/${chapter}/${verse}`;
  };

  return (
    <Box 
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #dbeafe 0%, #ffffff 50%)", 
        m: 0,
        p: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            color: "#0f2e60", 
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: { xs: "2rem", md: "3rem" }
          }}
        >
          Dumnezeu este cu noi
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="stretch" sx={{ mb: 8 }}>
          
          {/* COLOANA STÂNGA - ANIMATIE SLIDESHOW */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: "350px", md: "450px" },
                borderRadius: 4,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                overflow: "hidden", // Ascunde colțurile tăiate din interior
                position: "relative", // Baza pentru pozele suprapuse
                bgcolor: "#e0d6c2" // Culoare de fundal cat timp se incarca
              }}
            >
              {imaginiSlideshow.map((imagine, index) => (
                <Box
                  key={index}
                  component="img"
                  src={imagine}
                  alt={`Imagine slideshow ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    objectFit: "cover",
                    objectPosition: "center bottom",
                    // AICI SE ÎNTÂMPLĂ MAGIA FADE:
                    opacity: currentImageIndex === index ? 1 : 0, 
                    transition: "opacity 1.2s ease-in-out" 
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* COLOANA DREAPTA - VERSETUL ȘI BUTONUL */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Box
              sx={{
                bgcolor: "#fdfbf7",
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                border: "1px solid #e0d6c2",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 700, 
                  color: "#d4a373", 
                  mb: 3, 
                  textTransform: "uppercase",
                  letterSpacing: "2px"
                }}
              >
                Versetul Zilnic
              </Typography>
              
              <Typography
                component="p"
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontSize: { xs: 18, sm: 20, md: 24 },
                  lineHeight: 1.6,
                  color: "#3e2f1c",
                  mb: 2
                }}
              >
                {verseOfTheDay.text}
              </Typography>
              
              <Typography
                component="p"
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontSize: { xs: 16, md: 18 },
                  fontStyle: "italic",
                  color: "#8b7355",
                  mb: 4
                }}
              >
                — {verseOfTheDay.ref}
              </Typography>

              <Button
                variant="contained"
                href={getBibleLink(verseOfTheDay.ref)}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<AutoStoriesIcon />}
                sx={{
                  bgcolor: "#00875a",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 8px 20px rgba(0, 135, 90, 0.3)",
                  "&:hover": { 
                    bgcolor: "#006b47",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(0, 135, 90, 0.4)",
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Deschide Biblia
              </Button>
            </Box>
          </Box>
        </Stack>

      <Card
        sx={{
          mb: { xs: 3, md: 4 },
          background: "linear-gradient(135deg, #fffaf3 0%, #fef7e5 100%)",
          border: "1px solid #efe4cf",
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 20, md: 24 },
              mb: { xs: 1.25, md: 1.5 },
              textTransform: "uppercase",
              color: "#000",
            }}
          >
            Mesajul proiectului — Dumnezeu este cu noi
          </Typography>

          <Box
            sx={{
              mb: { xs: 3, md: 4 },
              borderRadius: 2,
              overflow: "hidden", 
              boxShadow: { xs: 1, md: 2 },
              "& img": {
                transition: "transform 0.5s ease", 
              },
              "&:hover img": {
                transform: "scale(1.05)", 
              }
            }}
          >
            <img
              src="/dumnezeuestecunoi.png"
              alt="Slujire, rugăciune și dragoste în acțiune"
              style={{ width: "100%", height: "auto", display: "block" }}
              onError={(e: any) => (e.currentTarget.style.display = "none")}
            />
          </Box>

          <Box sx={{ 
            fontFamily: "'Georgia', serif", 
            color: "#3e2f1c", 
            fontSize: { xs: 16, md: 17.5 }, 
            lineHeight: 1.9,
            textAlign: "justify"
          }}>
            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit",
              "&::first-letter": {
                fontSize: "3.2rem",
                fontWeight: "bold",
                color: "#0b3a6f", 
                float: "left",
                mr: 1.5,
                lineHeight: 0.85,
                mt: 1
              }
            }}>
              Căutați mai întâi Împărăția Lui Dumnezeu și neprihănirea Lui și aceste lucruri vi se vor da pe deasupra. În versetul acesta din Evanghelia scrisă de Matei ne spune cuvintele Mântuitorului Isus, fiul Lui Dumnezeu care sunt o parte a predicii de pe munte pe care Isus a avut-o către ucenici și multe neamuri.
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Aici Isus Hristos ne îndeamnă și ne încurajează și ne spune că voia Lui pentru noi oamenii este să căutăm Împărăția Lui. Isus subliniază aici că mai întâi, înainte de toate lucrurile, de orice, trebuie, suntem datori și este nevoie să căutăm Împărăția Lui Dumnezeu.
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Acest lucru înseamnă să dorim ca Dumnezeu să domnească în viața noastră, să trăim sub autoritatea Lui, nu în păcat cu lucruri păcătoase să ne cheltuim viața, nu să trăim viața după modelele lumii acesteia și nu după poftele noastre.
            </Typography>

            <Box sx={{
              borderLeft: "4px solid #15b91e",
              bgcolor: "rgba(21, 185, 30, 0.04)",
              pl: 2.5,
              py: 2,
              my: 3,
              borderRadius: "0 8px 8px 0",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "1.05em"
            }}>
              „Împărăția Lui Dumnezeu este dreptate, pace și bucurie în Duhul Sfânt” (Romani 14:17)
            </Box>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              A căuta Împărăția Lui Dumnezeu înseamnă să trăiești condus de Duhul Sfânt, în curăție, adevăr, smerenie și supunere față de Dumnezeu. Apoi neprihănirea Lui înseamnă și se referă la neprihănirea Lui Dumnezeu care este starea de sfințenie și curăție pe care Dumnezeu o cere, dar și prin neprihănirea pe care El o dă prin Isus Hristos.
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit", opacity: 0.9 }}>
              (În 2 Corinteni 5:21 Dumnezeu ne spune că L-a făcut păcat pe Isus care era fără păcat pentru noi, ca noi să fim neprihănirea Lui Dumnezeu în El).
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Iar dacă noi înfăptuim aceste lucruri, Dumnezeu ne promite că ne va da pe deasupra nevoile lumești: mâncare, băutură, îmbrăcăminte, locuință, protecție, direcție, viziune, îndrumare, loc de muncă – toate lucrurile pe care tu ți le dorești.
            </Typography>

            <Box sx={{
              borderLeft: "4px solid #15b91e",
              bgcolor: "rgba(21, 185, 30, 0.04)",
              pl: 2.5,
              py: 2,
              my: 3,
              borderRadius: "0 8px 8px 0",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "1.05em"
            }}>
              Apoi, în altă parte Dumnezeu ne spune în acest verset: „Duceți-vă în toată lumea și propovăduiți Evanghelia la orice făptură.” (Marcu 16:15)
            </Box>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Isus ne dă această poruncă după ce a înviat, să ne ducem în toată lumea și să spunem și să ducem vestea cea bună a mântuirii prin Isus Hristos, Mântuitorul și Salvatorul acestei lumi.
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Acest site nu este altceva decât un răspuns al copilului Lui Dumnezeu, Emanuel – un tânăr creștin din România – la chemarea de mai sus. Doresc ca toată Slava și Lauda să fie a Lui Dumnezeu Tatăl, Isus și Duhul Sfânt.
            </Typography>

            <Typography sx={{ mb: 4, fontSize: "inherit", fontFamily: "inherit", lineHeight: "inherit" }}>
              Dumnezeu să vă ajute tuturor să răspundeți la această chemare și să punem înainte de orice voia Lui Dumnezeu. Dumnezeu să vă binecuvânteze pe toți în toate lucrurile, întotdeauna. Doamne ajută.
            </Typography>

            <Box sx={{ 
              textAlign: "right", 
              borderTop: "1px solid rgba(0,0,0,0.08)", 
              pt: 3, 
              mt: 2 
            }}>
              <Typography sx={{ fontSize: "1.1em", fontFamily: "inherit", fontStyle: "italic", color: "#0b3a6f" }}>
                <b>Cu smerenie,</b><br/>Emanuel
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mb: { xs: 4, md: 6 },
          background: "linear-gradient(180deg, #f3f8ff 0%, #eef6ff 100%)",
          border: "1px solid #e1ecff",
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Typography
        variant="h4"
        align="center"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: { xs: "1.8rem", md: "2.2rem" }, 
          color: "#0f2e60", 
          mb: 5, 
          letterSpacing: "-0.5px"
        }}
      >
        Cum te poți implica?
      </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 2.5 }}
          sx={{ width: "100%" }}
        >
          <Card
            sx={{
              flex: 1,
              background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", 
              color: "#1e3a8a", 
              border: "none",
              borderRadius: 4,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 28px rgba(161, 196, 253, 0.4)" }, 
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  role="img"
                  aria-label="Mâini în rugăciune"
                  sx={{
                    width: 48, height: 48, borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 24, lineHeight: 1,
                  }}
                >
                  🙏
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, letterSpacing: "-0.5px" }}
                >
                  Roagă-te
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: "'Nunito', sans-serif", opacity: 0.95, fontWeight: 600, lineHeight: 1.6, fontSize: "0.95rem" }}>
                Când prezența fizică lipsește, rugăciunea devine cea mai puternică formă de apropiere.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              background: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", 
              color: "#1d3a1f",
              border: "none",
              borderRadius: 4,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 28px rgba(150, 230, 161, 0.3)" },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  role="img"
                  aria-label="Inimă din mâini"
                  sx={{
                    width: 48, height: 48, borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 26, lineHeight: 1,
                  }}
                >
                  🫶
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, letterSpacing: "-0.5px" }}
                >
                  Oferă ajutor
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: "'Nunito', sans-serif", opacity: 0.95, fontWeight: 600, lineHeight: 1.6, fontSize: "0.95rem" }}>
                Transformă compasiunea în gesturi care schimbă viețile oamenilor. Implică-te în proiecte de slujire și adu speranță celor aflați în nevoie.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", 
              color: "#4a1c22",
              border: "none",
              borderRadius: 4,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 28px rgba(255, 154, 158, 0.3)" },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  role="img"
                  aria-label="Scrisoare cu inimă"
                  sx={{
                    width: 48, height: 48, borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 24, lineHeight: 1,
                  }}
                >
                  💌
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, letterSpacing: "-0.5px" }}
                >
                  Împarte mai departe
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: "'Nunito', sans-serif", opacity: 0.95, fontWeight: 600, lineHeight: 1.6, fontSize: "0.95rem" }}>
                Distribuie proiectul prietenilor tăi și poartă mesajul Evangheliei către cei aflați în nevoie, prin orice formă de slujire și iubire.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Box
        sx={{
          mb: { xs: 4, md: 6 },
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: "1px solid #d9d4cb",
          boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
          background: `
            linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.7)),
            repeating-linear-gradient(
              0deg,
              #f7f4ee,
              #f7f4ee 24px,
              #f0ece4 25px,
              #f0ece4 26px
            )
          `,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: { xs: 1.5, md: 2 },
            borderBottom: "1px solid #d9d4cb",
            pb: 1,
          }}
        >
          <MailOutlineIcon />
          <Typography
            component="h3"
            sx={{
              fontFamily: '"Raleway", Helvetica, sans-serif',
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontWeight: 800,
              fontSize: { xs: 18, md: 20 },
            }}
          >
            Abonează-te la newsletter
          </Typography>
        </Box>

        <Typography
          sx={{
            opacity: 0.9,
            fontSize: { xs: 14.5, md: 15.5 },
            lineHeight: 1.75,
            mb: { xs: 2, md: 2.5 },
            maxWidth: 900,
          }}
        >
          Primește noutăți, îndemnuri, rugăciuni și proiecte de slujire direct pe e-mail.
          Fără spam. Te poți dezabona oricând.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ maxWidth: 720 }}
        >
          <TextField
            fullWidth
            placeholder="Numele tău"
            variant="outlined"
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <TextField
            fullWidth
            type="email"
            placeholder="Adresa de e-mail"
            variant="outlined"
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <Button
            variant="contained"
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              background:
                "linear-gradient(90deg, #0b3a6f 0%, #082c54 100%)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #0d488b 0%, #0a376a 100%)",
              },
            }}
          >
            Abonează-mă
          </Button>
        </Stack>

        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1.5, opacity: 0.7 }}
        >
          Prin abonare ești de acord cu prelucrarea datelor conform politicii de confidențialitate.
        </Typography>
      </Box>
    </Container>
    </Box>
  );
}