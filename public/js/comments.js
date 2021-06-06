

const postsList = document.querySelector('.comment_box ul');
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
    var div=document.createElement("div");
    var lab1=document.createElement("label");
    var br1=document.createElement("br");
    var br2=document.createElement("br");
    var br3=document.createElement("br");
    var br4=document.createElement("br");
    var p=document.createElement("p");
    var lab2=document.createElement("label");
    var b1 = document.createElement("button");
    

    //put id and class
    li.id = "a"+countId.toString();
    div.className = "the_comment";
    lab1.id = "l1"+countId.toString();
    p.id = "p"+countId.toString();
    lab2.id = "l2"+countId.toString();
    lab2.className = "likesComments"+countId.toString();

    b1.id = "b1"+countId.toString();
    b1.className = "likeBtn px-4 py-1";


    //create the post 
    li.appendChild(div);
    div.appendChild(lab1);
    lab1.appendChild(document.createTextNode("vasilis"));
    div.appendChild(br1);
    div.appendChild(br2);
    div.appendChild(p);
    p.appendChild(document.createTextNode(a));
    div.appendChild(br3);
    div.appendChild(lab2);
    lab2.appendChild(document.createTextNode("Likes:0"));
    div.appendChild(br4);
    div.appendChild(b1);
    b1.appendChild(document.createTextNode("Like"));

    //append the post to the post area
    postsList.prepend(li);
    

    //clear the input
    countId++;
    input.value='';
  
});


postsList.addEventListener("click",function(event){
var posts = document.querySelectorAll('.comment_box ul li');

for(var i=0;i<=posts.length;i++){
//event trigger
if (event.target.matches("#b1"+i)){
    var likeNumber = document.querySelector('.likesComments'+i.toString());

    var start = likeNumber.innerHTML.indexOf("Likes:") + "Likes:".length;
    var numOfLikes = likeNumber.innerHTML.slice(start);

    likeNumber.innerHTML ="Likes:"+(parseInt(numOfLikes)+1);

}
}

});
