const leftBody1 = document.querySelector('.left-body div:nth-child(1)');
const leftBody2 = document.querySelector('.left-body div:nth-child(2)');
const leftBody3 = document.querySelector('.left-body div:nth-child(3)');
const leftBody4 = document.querySelector('.left-body div:nth-child(4)');
const dropdown = document.querySelector('.left-body .dropdownBtn');


const categoriesCheck = document.querySelector('.left-body .categ-list');
const subBox = document.querySelector('.left-body div:nth-child(3) input');
const input = document.querySelector('.createdBy');

const allCatBoxes = document.querySelectorAll(".allTheCatBoxes a li div label");
const CatBox = document.querySelectorAll(".allTheCatBoxes a");   

const choose = document.querySelector(".upper-body select");   

dropdown.addEventListener('click',function(){
    if(leftBody1.style.display == "none"){
        leftBody1.style.display = "block";
        leftBody2.style.display = "block";
        leftBody3.style.display = "block";
        leftBody4.style.display = "block";
    }else{
        
        leftBody1.style.display = "none";
        leftBody2.style.display = "none";
        leftBody3.style.display = "none";
        leftBody4.style.display = "none";
    }
    
    
})



input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      
      let a = document.getElementById('createdBy').value;
      for(j of CatBox){
        j.style.display="";
        }
        count=0;

      for(let i=1;i<allCatBoxes.length;i=i+4){
        if(allCatBoxes[i].innerHTML.toString()!=" Created by: "+a){
            CatBox[(i-1)/4].style.display="none";
            count++;
        }

        if(count==CatBox.length){
            for(a of CatBox){
                a.style.display="";
            }
        }
      }
    input.value='';
    }
  });


subBox.addEventListener("click", function() {
    if(subBox.checked ==true){
        var array = [];
        fetch('/getallsubs')
      .then(response => response.json())
      .then(data => 
        array.push(data)
      );
    
      setTimeout(() => {  
    
        for(a of CatBox){
            a.style.display="none";
        }
    
        for(let i=0;i<allCatBoxes.length;i=i+4){
            for(j of array[0]){
                if(allCatBoxes[i].innerHTML.toString()=="Categorie: "+j.categoryName){
                    CatBox[(i)/4].style.display="";
                }
    
                
            }
          
        }
        if(array.length==0){
            for(a of CatBox){
                a.style.display="";
            }
        }
       }, 1000);
    }
    else{
        for(a of CatBox){
            a.style.display="";
        }
    }
   


    
    

  });
  

  categoriesCheck.addEventListener("click", function(event){
    var arr =[];
    

    const allcat = document.querySelectorAll('.left-body .categ-list li input');
    for(i of allcat){
        if(i.checked == true){
            arr.push(i);
        }
    }
    
    for(a of CatBox){
        a.style.display="none";
    }

    for(let i=0;i<allCatBoxes.length;i=i+4){
        for(j of arr){
            if(allCatBoxes[i].innerHTML.toString()=="Categorie: "+j.className){
                CatBox[(i)/4].style.display="";
            }

            
        }
      
    }
    if(arr.length==0){
        for(a of CatBox){
            a.style.display="";
        }
    }
  })