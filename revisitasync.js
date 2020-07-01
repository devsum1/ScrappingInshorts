// const add = (a,b,callback)=>{
//    setTimeout(() => {
//        callback(a+b);
//    }, 3000);
// }

// add(12,13,(sum)=>{
//     console.log(sum);
// })

const deletedocuments = (arr)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            if(arr.length == 0)
                return reject('No elements present');
            arr.pop();
            resolve(arr);
        }, 2000);
    })
}

const countdocuments = (brr)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(brr.length);
        }, 2000);
    })
}

//Using Promise Chaining
// deletedocuments([1,2,3,4,5,6,7]).then((res)=>{
//     console.log(res);
//     return countdocuments(res);
    
// }).then((res2)=>{
//     console.log(res2);
// }).catch(err => console.log(err));


//Using async await

const deletedocumentsasync  = async ()=>{
    const arrone = await deletedocuments([]);
    const newarr = await deletedocuments(arrone);
    const newarr1 = await deletedocuments(newarr);
    return newarr1;
}

deletedocumentsasync()
.then((result)=>console.log(result))
.catch(err => console.log(err))