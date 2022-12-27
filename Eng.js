        // Изменения
        
    let Round = 0;        
    let Hold = 0;
    let modeEnTrans = [0, 1];
    let modeTransEn = [0, 2];
    let badLearn = [];
    let Words =[];
    let NewWords = [];
    let ModeDisplay = 1;        //Режим отображения слов на карточке
    let curentMode = 2; 
    let curentIndex = -1;
    let workIndex = 0;
    let LastFromEnd =40;   
    let countGoodLearn = 0;
    let Add = 0;
    let AddNew = 30;

           
        // Предварительные настройки
        
        if(BackFromLS("AllWords")!==null) Words = BackFromLS("AllWords");
        if(BackFromLS("NewWords")!==null) NewWords = BackFromLS("NewWords");
        if(BackFromLS("BadLearn")!==null) badLearn = BackFromLS("BadLearn");

        
        MaxToMin();
        Good();
        Add = AddNew - (Words.length - countGoodLearn) ;
        FromTo(Words, NewWords, Add);        
        DisplayScores();            
            // ResetAllCount();  
        console.log("++++++++++   " + BackFromLS("AllWords"));
        let RandomArrayIndex = rand(Words);
        let WorkArr = CurrentArray(curentMode);
        
        
    // console.log("RandomArrayIndex  " + RandomArrayIndex );   
            
        // Buttons

        let buttAdd = document.querySelector("#add");
        buttAdd.addEventListener("click", function (){AddWord(NewWords); AddToLS(NewWords, "NewWords");  ResetForm();DisplayScores(); });

        let buttDelete = document.querySelector("#delete");
        buttDelete.addEventListener("click", ()=>{deleteFromLS(Words, curentIndex, "AllWords");DisplayScores(); console.log(Words)});
        
      
        let buttNext = document.querySelector("#next");
        buttNext.addEventListener("click", ForNextButton );

        let buttPrev = document.querySelector("#prev");
        buttPrev.addEventListener("click", ForPrevButton);

        let buttMode = document.querySelector("#mode");
        buttMode.addEventListener("click", () => {curentMode = roundNumber(3, curentMode );WorkArr = CurrentArray(curentMode); curentIndex = -1; DisplayScores()});
        

        let buttEngToTrans = document.querySelector("#EngToTr");
        buttEngToTrans.addEventListener("click", AlgoritmButtonEngToTrans );

        let buttTransToEng = document.querySelector("#TrToEng");
        buttTransToEng.addEventListener("click", AlgoritmButtonTransToEng );

        let buttNoProp = document.querySelector("#NoProp");
        buttNoProp.addEventListener("click", AlgoritmNoProperly);

        let buttClear = document.querySelector("#clear");
        buttClear.addEventListener("click", ()=>{localStorage.removeItem("BadLearn"); DisplayScores();});

       
    
// Конец кнопок
 

// Выбирает массив со словами и насраивает рабочий массив 
function CurrentArray(ModeNumber)
{
    switch(ModeNumber)
    {
                case 0: 
                {
                    document.querySelector("#mode").innerHTML = "Все слова";
                    RandomArrayIndex = rand(Words);
                    startFrom = Words.length;
                    return Words;
                }
                case 1: 
                {
                    document.querySelector("#mode").innerHTML = "Повторить"
                    startFrom = badLearn.length;
                    RandomArrayIndex = rand(badLearn);
                    return badLearn;
                }
                case 2:
                {
                    if (Words.length >=LastFromEnd) startFrom = LastFromEnd;
                    else startFrom = Words.length;
                    document.querySelector("#mode").innerHTML = startFrom + " крайних"                    
                    RandomArrayIndex = rand(Words, startFrom);
                    return Words;
                }        
    }
}
    // Алгоритмы кнопок

    function AlgoritmButtonEngToTrans()
    {                
        ForScrolButtons(modeEnTrans);   
    }

    function AlgoritmButtonTransToEng()
    {
        ForScrolButtons(modeTransEn);
    }

    function AlgoritmNoProperly()
    {
        WorkArr[workIndex].PropCount = 0;
        CopyWord(WorkArr, badLearn);
        AddToLS(badLearn, "BadLearn");             
        AddToLS(Words, "AllWords");
        Hold = 1;
        Good();
        DisplayScores();
    }

    function ForNextButton()
    {
        curentIndex++;
        if (curentIndex >= Words.length ) curentIndex = 0;
        SelectMode(Words, 0, curentIndex); 
        DisplayScores(); 
    }
    function ForPrevButton()
    {
        curentIndex--;
        if (curentIndex < 0 ) curentIndex = Words.length-1;
        SelectMode(Words, 0, curentIndex); 
        DisplayScores();
    }

    
    function ForScrolButtons(arrDisplayInfo)
    {
        if (ModeDisplay == 1) curentIndex = RoundCursor(RandomArrayIndex, curentIndex);        
        let DisplayMassage = arrDisplayInfo[ModeDisplay];        
        if ((curentMode == 0 || curentMode ==2) && ModeDisplay==0)
        {
            WorkArr[workIndex].TotalCount++;
            WorkArr[workIndex].PropCount++;                 
        }  
        if(Hold == 1 && DisplayMassage==0)
        {
            Words[workIndex].PropCount--;
            Hold = 0;          
        }        
        if (curentIndex < 0) curentIndex = 0;
        workIndex = RandomArrayIndex[curentIndex];
        SelectMode(WorkArr, DisplayMassage, workIndex);  
        DisplayScores(); 
        ModeDisplay = roundNumber(2, ModeDisplay);          
        Good();
        AddToLS(Words, "AllWords");
    }

    //   Маленькие независимые функции   

    // Считает хорошо выученные слова
    function Good()
    {countGoodLearn = 0;
        for(let i = 0; i < Words.length; i++)      
        if(Words[i].PropCount>=10) countGoodLearn++; 
    }
    // Копипование из массива в массив
    function FromTo(arrTo, arrFrom, count){
        if (count)
        {
            if (count > arrFrom.length) count = arrFrom.length; 
            for (let i = 0; i < count; i++)
            {
                arrTo.push(arrFrom[i]);          
            }
            arrFrom.splice(0, count);
            AddToLS(arrTo, "AllWords");
            AddToLS(arrFrom, "NewWords");

        }
    }



    // Работа с localStorage
    function AddToLS(Data, key)
    {     
        repetitionСheck(Data);
        let newStringData = JSON.stringify(Data);
        localStorage.setItem(key, newStringData);
    }

    function BackFromLS(key)
    {
        return JSON.parse(localStorage.getItem(key))
    }

    function deleteFromLS(Data, index, key)
    {
        Data.splice(index, 1)
        let newStringData = JSON.stringify(Data);
        localStorage.setItem(key, newStringData);
    }

    
    // Сбрасывает все счетчики
    function ResetAllCount()
    {
        for(let i = 0; i < Words.length; i++)
        {
            Words[i].PropCount = 0;
            Words[i].TotalCount = 0;
        }       
    }

    // Сброс формы
    function ResetForm()
    {
        inWord.Eng.value = null;
        inWord.Trans.value = null;
        inWord.EngComent.value = null;
        inWord.TransComent.value = null;
    }

       // Добавляет новое Слово-обьект в переданный массив arr            
     function AddWord(arr)
    {
        let WordObj =  { 
            "EngWord": inWord.Eng.value,
            "TransWord": inWord.Trans.value,
            "ComentEng": inWord.EngComent.value,
            "ComentTrans": inWord.TransComent.value,
            "PropCount": 0,
            "TotalCount": 0,
            };           
        arr.push(WordObj);
    }

     // Сортировка массивов
     function MaxToMin()
     {       
         let time;         
         for(let i = 0; i < Words.length; i++)
         {
             for(let j = i; j < Words.length; j++)
             {
                 if(Words[i].PropCount < Words[j].PropCount)
                 {
                     time = Words[i];
                     Words[i] = Words[j];
                     Words[j] = time;
                 }
             }
         }
     }

     // Копирует слово из curentArr в reciveArr
     function CopyWord(curentArr, reciveArr)
     {
         reciveArr.push(curentArr[workIndex]);
     }
     
     function DisplayData(Data, mode)
     {   
         curentIndex = RoundCursor(Data, curentIndex)
         SelectMode(Data, mode);         
     } 

     // amountNumber - колличество чисел, 
            // curent - текущее число
            // перебирает числа по кругу
            function roundNumber(amountNumber, curent)
            {   
                curent++;
                if (amountNumber == curent) curent = 0;
                console.log("curent ",curent);   
                return curent;                                  
            }

            function RoundCursor(Data, count)
            {                
            if(Data.length == 0)
            {
                document.querySelector("#Eng").innerHTML = "SINGLE";
                document.querySelector("#Trans").innerHTML = "SINGLE";
            }
            if (count < Data.length)  count++;  
            if(count >= (Data.length))
            {  
                let lastInd = RandomArrayIndex[RandomArrayIndex.length-1];
                RandomArrayIndex = rand(WorkArr, startFrom, lastInd);
                AddToLS(Words, "AllWords");
                Round++;
                return count = 0;
            }
            else if (count < 0) return count = (Data.length-1);
            else return count; 
        } 

      //  Рандомный массив
    // 1-й парам массив;
    // 2-й парам начальное значение рандомного числа 
    // 3-й парам значение которому не будет равен нулевой индекс, нужен для того что бы последнее значение массива не совпадало с первым
    function rand(arr, numFromEnd = (arr.length), zeroIndexNone = 0)
    {if(arr.length > 1)
        {
        let randArr = [];      
        for (let i = 0 ;  i < numFromEnd; i++)
        {
             let rando
            do{
                rando = Math.floor(Math.random()*(arr.length-1));
            }while(rando < ((arr.length-1) - numFromEnd))

            for(let j = 0; j <= i; j++)
            {
                if((randArr[j] == rando) || (rando <= (arr.length-1)-numFromEnd) || (randArr[0]==undefined && rando == zeroIndexNone) )
                {
                    rando = Math.floor(Math.random()*(arr.length));
                    j = -1;                    
                }
            }
            randArr[i] = rando;
        }        
        return randArr;
        }
        
    }     
    
     // Проверка на повторяемость в массиве
    function repetitionСheck(Data)
    {
        
        for(let i = 0 ; i < Data.length ; i++)
        {
            for( let j =i+1 ; j < (Data.length) ; j++)
            {
                
                if(Data[i].EngWord == Data[j].EngWord)
                {
                    Data.splice(j , 1);
                    j--;
                }
            }
        }
    } 

        
        //    Отображение данных
        
        function DisplayScores()
        {
            document.querySelector("#bad").innerHTML = "На изучении<br>" + badLearn.length;
            document.querySelector("#total").innerHTML = "Всего слов<br>" + Words.length;
            document.querySelector("#good").innerHTML = "Хорошо выученных<br>" + countGoodLearn;
            document.querySelector("#round").innerHTML = "круг<br>" + Round;
            document.querySelector("#curent").innerHTML = "текущее<br>" + (curentIndex+1);
            document.querySelector("#dispNewWord").innerHTML = "Новых слов<br>" + NewWords.length;
        }

        function SelectMode(arr, mode, index)
        { 
            switch(mode)
                {
                    case 0:
                        {
                            document.querySelector("#EngComents").innerHTML = arr[index].ComentEng;
                            document.querySelector("#TransComents").innerHTML = arr[index].ComentTrans;
                            document.querySelector("#Eng").innerHTML = arr[index].EngWord;
                            document.querySelector("#Trans").innerHTML = arr[index].TransWord;
                            break;
                        }
                    case 1:
                        {
                            document.querySelector("#EngComents").innerHTML = arr[index].ComentEng;
                            document.querySelector("#TransComents").innerHTML = "? ? ?";
                            document.querySelector("#Eng").innerHTML = arr[index].EngWord;
                            document.querySelector("#Trans").innerHTML = "? ? ?";
                            break;
                        }
                    case 2:
                        {
                            document.querySelector("#EngComents").innerHTML = "? ? ?";
                            document.querySelector("#TransComents").innerHTML = arr[index].ComentTrans;
                            document.querySelector("#Eng").innerHTML = "? ? ?";
                            document.querySelector("#Trans").innerHTML = arr[index].TransWord;
                            break;
                        }
                }

        }

    // -------------------------------------------------- Список слов----------------------

let common = document.querySelector('.common');
let listbut = document.querySelector('#listbut');
let lernbut = document.querySelector('#leanBut');
let tableHead = document.querySelector('.head tr');
let tableWords = document.querySelector('.wordList table');
let using = document.querySelector('.Using');
let buttNew = document.querySelector('#New');
let loadFlag = true;

console.log(tableHead);
console.log(tableWords);


lernbut.onclick = function(){
    common.style.display = 'block';
    using.style.display = 'none';
}

listbut.onclick = function(){
    common.style.display = 'none';
    using.style.display = 'block';
    if (loadFlag) fillTable();
}

buttNew.onclick = function(){
    common.style.display = 'none';
    using.style.display = 'none';
   
}

function fillTable(){
    Words.forEach(element => {
        let row = tableHead.cloneNode(true);
        tableWords.append(row)
        let coll = row.querySelectorAll('td')
        coll.forEach(column => {
           let compare = column.dataset.content;
            for( let prop in element)
            {
                 if(compare === prop) column.innerHTML = element[prop];
            }
        })
    })
    loadFlag = false;
}