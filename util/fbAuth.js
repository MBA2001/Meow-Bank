

module.exports = (req,res,next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else {
        console.error('no token found');
        return res.status(403).json({error:'unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
        .then(token => {
            req.user = token;
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().userHandle;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            if(req.user.imageUrl === undefined) req.user.imageUrl = '';
            return next();
        })
        .catch(err => {res.status(403).json({err})})
}