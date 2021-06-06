
const postsList = document.querySelector('.posts ul');
const postsListLike = document.querySelector('.likeBtn');


const input = document.querySelector('.txtArea');

const inputBtn = document.querySelector('.txtAreaBtn');






var countId=1;


inputBtn.addEventListener("click", function() {
        // console.log(countId);
        let a = input.value;
  
        //if you put nothing
        if(a===''){
          return;
        }
        //append li to ul 
        
        var li=document.createElement("li");
        var ah=document.createElement("a");
        var div=document.createElement("div");
        var lab1=document.createElement("label");
        var br1=document.createElement("br");
        var br2=document.createElement("br");
        var br3=document.createElement("br");
        var br4=document.createElement("br");
        var p=document.createElement("p");
        var lab2=document.createElement("label");
        var b1 = document.createElement("button");
        var b2 = document.createElement("button");

        //put id and class
        ah.href = "comments.html";
        li.id = "a"+countId.toString();
        lab1.id = "l1"+countId.toString();
        p.id = "p"+countId.toString();
        lab2.id = "l2"+countId.toString();
        lab2.className = "likesNumber"+countId.toString();

        b1.id = "b1"+countId.toString();
        b2.id = "b2"+countId.toString();
        b1.className = "likeBtn px-4 py-1";
        b2.className = "px-3 py-1 mx-2";


        //create the post 
        li.appendChild(ah);
        ah.appendChild(div);
        
        div.appendChild(lab1);
        lab1.appendChild(document.createTextNode("Posted by vasilis"));
        div.appendChild(br1);
        div.appendChild(br2);
        div.appendChild(p);
        p.appendChild(document.createTextNode(a));
        div.appendChild(br3);
        div.appendChild(lab2);
        lab2.appendChild(document.createTextNode("Likes:0 Comments:0"));
        div.appendChild(br4);
        div.appendChild(b1);
        b1.appendChild(document.createTextNode("Like"))
        div.appendChild(b2);
        b2.appendChild(document.createTextNode("Comment"));

        //append the post to the post area
        postsList.prepend(li);
        
  
        //clear the input
        countId++;
        input.value='';
      
  });


postsList.addEventListener("click",function(event){
  var posts = document.querySelectorAll('.posts ul li');

  for(var i=0;i<=posts.length;i++){
    //event trigger
    if (event.target.matches("#b1"+i)){
        var likeNumber = document.querySelector('.likesNumber'+i.toString());

        var start = likeNumber.innerHTML.indexOf("Likes:") + "Likes:".length;
        var end = likeNumber.innerHTML.indexOf("Comments:");
        var numOfLikes = likeNumber.innerHTML.slice(start,end);
        var numOfSubs = likeNumber.innerHTML.slice(end+"Comments:".length);

        likeNumber.innerHTML ="Likes:"+(parseInt(numOfLikes)+1) + " Comments:"+numOfSubs;

    }
  }

  });
