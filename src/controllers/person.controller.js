import { People } from '../repositories/unitOfWork'
import logger from '../errorHandler'
import formidable from 'formidable'
import ftp from 'ftp'
import config from '../config'
var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
/**
 * 
 * @api{post}/api/people Creating a person
 * @apiName CreatePerson
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} returns Person Document
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *  {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */

const create = (req, res) => {
    People.insert(req.body, (status, result) => {
        logger.info('Creating a person')
        if (status > 300) logger.error('Creating a person')
        res.status(status).send(result)
    })
}


/**
 * 
 * @api{post}/api/people Listing a person
 * @apiName ListPerson
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} returns Person Documents
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *  {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */
const list = (req, res) => {
    People.getAll((status, result) => {
        logger.info('Listing a person')
        if (status > 300) logger.error('Listing a person')
        res.status(status).send(result)
    },
        [{ include: 'engagement.team', fields: 'name' }]
    )
}

/**
 * 
 * @api{get}/api/people/:id Finding a person by Id
 * @apiName FindPersonById
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} returns a Person Document
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *  {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */
const personById = (req, res, next, id) => { req.id = id; next() }

/**
 * 
 * @api{get}/api/people/:id Reading a person by Id
 * @apiName ReadPersonById
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} returns a Person Document
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *  {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */

const read = (req, res) => {
    People.getOne(req.id, (status, result) => {
        logger.info('Reading a person')
        if (status > 300) logger.error('Reading a person')
        res.status(status).send(result)
    })
}

/**
 * 
 * @api{put}/api/calendar/:id Updating a person by Id
 * @apiName UpdatePerson
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} updates a Person Document
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *   {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */

 

const update = (req, res) => {
  console.log('normalni update')
  People.update(req.id, req.body, (status, result) => {
      console.log(status, result)
    logger.info("Updating a person");
    if (status > 300) logger.error("Updating a person");
    res.status(status).send(result);
  });
};

const update2 = (req, res) => {
  console.log('update2')
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
  if (files.photo) {
//     let newfilepath=filesp
//   sharp(files.photo.path).resize({ height: 200, width: 200 }).toFile(files.photo.path)
//   .then(function() {
      let photo=base64_encode(files.photo.path)
//   })
      People.getOne(req.id, (status, result) => {
// console.log('AAAAAAAAAAAAAAAAAAAAAA',base64_encode(files.photo.path)) 
         if (status === 200) {
            //   console.log(result)
              const person = {
                firstName: result.firstName,
                lastName: result.lastName,
                position: result.position,
                gender: result.gender,
                birthday: result.birthday,
                status: result.status,
                beginDate: result.beginDate,
                email: result.email,
                phone: result.phone,
                image: result.image,
                endDate: result.endDate,
                image:`data:image/png;base64,${photo}`
              };
            //   result.body.image=base64_encode(files.photo.path)
              People.update(req.id,person, (status, result) => {
                res.status(status).send(result)
                // console.log('status',status)
            })
            //   let client = new ftp()
            //   client.on('ready', () => {
            //       client.put(files.photo.path, fields.image + '.jpg', (err) => {
            //         if(err)console.log(err)
            //           client.end()
            //       })
            //   })
            //   client.connect(config.ftpOptions)
          }
      })
  }
  });
};
/**
 * 
 * @api{delete}/api/people/:id Removing a person
 * @apiName RemovePerson
 * @apiGroup Person
 * @apiVersion 1.0.0
 * @apiSuccess {Person} removes a Person Document
 * @apiSuccess {Number} status should be 200
 * @apiSuccessExample Example data on success
 *  {
        "_id": "5c98d07a210e8333b42f43c6",
        "firstName": "neko",
        "engagements": [],
        "__v": 0,
        "currentMonth": "5c98d5954c52050c1c974ee8"
    }
 * }
 */

const remove = (req, res) => {
    People.remove(req.id, (status, result) => {
        logger.info('Removing a person')
        if (status > 300) logger.error('Removing a person')
        res.status(status).send(result)
    })
}

export default { create, list, personById, read, update, update2, remove }