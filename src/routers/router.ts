import express from 'express'
import aws from "aws-sdk";
import multer from "multer";
import moment from "moment"
import momentDurationFormat from "moment-duration-format";


const router = express.Router()
const upload = multer();
const uploadFiles = multer().array('file',2);


/**Config AWS */
const REGION_AWS = 'us-east-1';
const ROLE_REKOGNITION_ARN = 'arn:aws:iam::482505930630:role/RoleRekognition';
const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:482505930630:videos-rekognition';
const BUCKET_NAME_VIDEOS = 'curso-rekognition-video';

/**FORMS */
const FORM_INDEX = "pages/index";
const FORM_LABEL_DETECTION = "pages/form-label-detection";
const FORM_LABEL_DETECTION_S3 = "pages/form-label-detection-s3";
const FORM_IMAGE_MODERATION = "pages/form-image-moderation";
const FORM_CELEBRITY_RECOGNITION = "pages/form-celebrity-recognition";
const FORM_FACIAL_ANALYSIS = "pages/form-facial-analysis";
const FORM_TEXT_IMAGE = "pages/form-text-image";
const FORM_FACES_COMPARISON = "pages/form-faces-comparison";
const FORM_CREATE_COLLECTION = "pages/form-create-collection";
const FORM_INDEX_FILE_COLLECTION = "pages/form-index-file-collection";
const FORM_FIND_IMAGE_COLLECTION = "pages/form-find-image-collection";
const FORM_FACIAL_ANALYSIS_S3 = "pages/form-facial-analysis-s3";
const FORM_VIDEO_SEND_LABEL_DETECTION = "pages/form-video-send-label-detection";
const FORM_VIDEO_GET_LABEL_DETECTION_S3 = "pages/form-video-label-detection-s3";


/**PATHS VIEW */
const PATH_VIEW_FORM_LABEL_DETECTION = '/viewLabelDetection';
const PATH_VIEW_FORM_LABEL_DETECTION_S3 = '/viewLabelDetectionS3';
const PATH_VIEW_IMAGE_MODERATION = '/viewImageModeration';
const PATH_VIEW_CELEBRITY_RECOGNITION = '/viewCelebrityRecognition';
const PATH_VIEW_FACIAL_ANALYSIS = '/viewFacialAnalysis';
const PATH_VIEW_TEXT_IMAGE = '/viewTextImage';
const PATH_VIEW_FACES_COMPARISON = '/viewFacesComparison';
const PATH_VIEW_CREATE_COLLECTION = '/viewCreateCollection';
const PATH_VIEW_INDEX_FILE_COLLECTION = '/viewIndexFileCollection';
const PATH_VIEW_FIND_IMAGE_COLLECTION = '/viewFindImageCollection';
const PATH_VIEW_FACIAL_ANALYSIS_S3 = '/viewFacialAnalysisS3';
const PATH_VIEW_VIDEO_SEND_LABEL_DETECTION = '/viewSendVideoLabelDetection';
const PATH_VIEW_VIDEO_GET_LABEL_DETECTION_S3 = '/viewVideoGetLabelDetectionS3';

router.get('/', (request,response) => {
  response.render(FORM_INDEX);
});

router.get(PATH_VIEW_FORM_LABEL_DETECTION, (request,response) => {
  response.render(FORM_LABEL_DETECTION, {
    dataDetectedLabels: []
  });
});

router.get(PATH_VIEW_IMAGE_MODERATION, (request,response) => {
  response.render(FORM_IMAGE_MODERATION, {
    dataImageModeration: []
  });
});

router.get(PATH_VIEW_CELEBRITY_RECOGNITION, (request, response) =>{
  response.render(FORM_CELEBRITY_RECOGNITION, {
    dataCelebrityRecognition: []
  });
})

router.get(PATH_VIEW_FACIAL_ANALYSIS, (request,response) => {
  response.render(FORM_FACIAL_ANALYSIS, {
    dataFacialAnalysis: []
  });
});

router.get(PATH_VIEW_TEXT_IMAGE, (request,response) => {
  response.render(FORM_TEXT_IMAGE, {
    dataTextDetections: []
  })
})

router.get(PATH_VIEW_FACES_COMPARISON, (request,response) =>{
  response.render(FORM_FACES_COMPARISON, {
    dataFacesComparison: [],
    msg: null
  })
})

router.get(PATH_VIEW_CREATE_COLLECTION, (request,response) =>{
  response.render(FORM_CREATE_COLLECTION)
})

router.get(PATH_VIEW_INDEX_FILE_COLLECTION, (request, response) =>{
  response.render(FORM_INDEX_FILE_COLLECTION, {
    msg: null
  })
})

router.get(PATH_VIEW_FIND_IMAGE_COLLECTION, (request,response) =>{
  response.render(FORM_FIND_IMAGE_COLLECTION, {
    dataFindImageCollection: []
  })
})

router.get(PATH_VIEW_FORM_LABEL_DETECTION_S3, (request,response) =>{
  response.render(FORM_LABEL_DETECTION_S3, {
    dataDetectedLabels: []
  })
})

router.get(PATH_VIEW_FACIAL_ANALYSIS_S3, (request,response) => {
  response.render(FORM_FACIAL_ANALYSIS_S3, {
    dataFacialAnalysis: []
  });
});

router.get(PATH_VIEW_VIDEO_SEND_LABEL_DETECTION,  (request, response) =>{
  response.render(FORM_VIDEO_SEND_LABEL_DETECTION, {
    msg: null
  })
})

router.get(PATH_VIEW_VIDEO_GET_LABEL_DETECTION_S3, (request,response) => {
  response.render(FORM_VIDEO_GET_LABEL_DETECTION_S3, {
    dataDetectedLabels: []
  });
});

/**
 * Executa a função para verificar labels de acordo com uma foto
 */
router.post('/labelDetection', upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      Bytes: arquivo
    },
    MaxLabels: 50, //Quantidade de labels retornada
    MinConfidence: 70.0 //Percentual de acerto
  };

  rekognition.detectLabels(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      //console.log(data);    
      if(data.Labels !== undefined){
        response.render(FORM_LABEL_DETECTION, {
          dataDetectedLabels: data.Labels
        });
      }
    }
  })
})

/**
 * Verifica conteúdo impróprio a partir de uma foto.
 */
router.post('/imageModeration', upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;

  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      Bytes: arquivo
    },
    MinConfidence: 70.0
  };

  rekognition.detectModerationLabels(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      if(data.ModerationLabels !== undefined){
          response.render(FORM_IMAGE_MODERATION, {
            dataImageModeration: data.ModerationLabels
          });
      }
    }
  })
})

/**
 * 
 */
router.post('/facialAnalysis', upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;

  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      Bytes: arquivo
    },
    Attributes: ['ALL']
  };

  rekognition.detectFaces(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      if(data.FaceDetails !== undefined){
          response.render(FORM_FACIAL_ANALYSIS, {
            dataFacialAnalysis: data.FaceDetails
          });
      }
    }
  })
})

/**
 * Verifica pessoas famosas a partir da foto.
 */
router.post('/celebrityRecognition', upload.single('file'), function(request, response){

  var arquivo = request?.file?.buffer;

  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      Bytes: arquivo
    }
  };

  rekognition.recognizeCelebrities(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      if(data.CelebrityFaces !== undefined){
          response.render(FORM_CELEBRITY_RECOGNITION, {
            dataCelebrityRecognition: data.CelebrityFaces
          });
      }
    }
  })

})

/**
 * Verifica textos a partir de uma imagem.
 */
router.post('/textImage', upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      Bytes: arquivo
    }
  };

  rekognition.detectText(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);    
      if(data.TextDetections !== undefined){
        response.render(FORM_TEXT_IMAGE, {
          dataTextDetections: data.TextDetections
        });
      }
    }
  })
})

/**
 * Compara duas fotos. 
 */
router.post('/facesComparison', uploadFiles, function(request, response){
  
  var arquivo1;
  var arquivo2;
  if(request.files !== undefined){
    const reqFiles: any | Express.Multer.File[] = request.files
    arquivo1 = reqFiles[0].buffer;
    arquivo2 = reqFiles[1].buffer;
  }
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    SimilarityThreshold: 90,
    SourceImage: {
      Bytes: arquivo1
    },
    TargetImage: {
      Bytes: arquivo2
    }
  };

  rekognition.compareFaces(params, function(err, data){
    if(err){
      console.log(err, err.stack);
      response.render(FORM_FACES_COMPARISON, {
        msg: err + " - Necessário 2 arquivos de foto com faces!",
        dataFacesComparison: []
      })
      
    } else {
      if(data.FaceMatches !== undefined){
        console.log(data)
        response.render(FORM_FACES_COMPARISON, {
          dataFacesComparison: data.FaceMatches,
          msg: null
        });
      }
    }
  })
})

/**
 * Cria uma collection na AWS.
 */
router.post('/createCollection', function(request, response){

  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var collectionId = request.body.collectionId;

  var params = {
    CollectionId: collectionId
  }

  rekognition.createCollection(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  })
})

/**
 * 
 */

router.post('/indexFileCollection',upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;
  var collectionId = request.body.collectionId;
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    CollectionId: collectionId,  
    Image: { 
      Bytes: arquivo,
    },
    DetectionAttributes: ['ALL'],
    ExternalImageId: request.file?.originalname,
    MaxFaces: 10,
    QualityFilter: 'AUTO'
  };

  rekognition.indexFaces(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {  
      if(data.FaceRecords !== undefined && data.FaceRecords.length > 0){
        response.render(FORM_INDEX_FILE_COLLECTION, {
          msg: "Arquivo indexado com sucesso na collection " + collectionId + "."
        });
      }
    }
  })

})

router.post('/findImageCollection',upload.single('file'), function(request, response){
  
  var arquivo = request?.file?.buffer;
  var collectionId = request.body.collectionId;
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    CollectionId: collectionId,  
    Image: { 
      Bytes: arquivo,
    },
    MaxFaces: 50,
    FaceMatchThreshold: 80
  };

  rekognition.searchFacesByImage(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {  
      console.log(data)
      if(data.FaceMatches !== undefined && data.FaceMatches.length > 0){
        response.render(FORM_FIND_IMAGE_COLLECTION, {
          dataFindImageCollection: data.FaceMatches
        });
      }
    }
  })

})

/**
 * Executa a função para verificar labels de acordo com uma foto
 */
 router.post('/labelDetectionS3', function(request, response){
  
  var arquivo = request.body.pathPhoto;
  console.log(arquivo)
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      S3Object: {
        Bucket: 'aws-rekognition-fotos',
        Name: arquivo
      }
    },
    MaxLabels: 50, //Quantidade de labels retornada
    MinConfidence: 70.0 //Percentual de acerto
  };

  rekognition.detectLabels(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);    
      if(data.Labels !== undefined){
        response.render(FORM_LABEL_DETECTION_S3, {
          dataDetectedLabels: data.Labels
        });
      }
    }
  })
})

router.post('/facialAnalysisS3', function(request, response){
  
  var arquivo = request.body.pathPhoto

  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    Image: {
      S3Object: {
        Bucket: 'aws-rekognition-fotos',
        Name: arquivo
      }
    },
    Attributes: ['ALL']
  };

  rekognition.detectFaces(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      if(data.FaceDetails !== undefined){
          response.render(FORM_FACIAL_ANALYSIS_S3, {
            dataFacialAnalysis: data.FaceDetails
          });
      }
    }
  })
})

router.post('/startLabelDetection', function(request,response){
  
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();
  var nome_video = request.body.videoLabel;

  var params = {
      ClientRequestToken: Date.now().toString(),
      JobTag: 'video_label',
      MinConfidence: 80,
      NotificationChannel: { 
        RoleArn: ROLE_REKOGNITION_ARN,
        SNSTopicArn: SNS_TOPIC_ARN
      },
      Video: { 
        S3Object: { 
          Bucket: BUCKET_NAME_VIDEOS,
          Name: nome_video
         }
      }
   }

  //rekognition.startCelebrityRecognition --Usado para analisar videos com celebridades
  rekognition.startLabelDetection(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      response.render(FORM_VIDEO_SEND_LABEL_DETECTION, {
        msg: "JobId: " + data.JobId
      });
    }
  })
})

router.post('/getLabelDetectionS3', function(request, response){
  
  var job_id = request.body.jobId;
  aws.config.update({region:REGION_AWS})
  var rekognition = new aws.Rekognition();

  var params = {
    JobId: job_id,
    MaxResults: 1000,
    SortBy: 'TIMESTAMP'
   };

  //rekognition.getCelebrityRecognition -- usado para obter dados de celebridades
  rekognition.getLabelDetection(params, function(err, data){
    if(err){
      console.log(err, err.stack);
    } else {
      console.log(data);    
      if(data.Labels !== undefined){
        response.render(FORM_VIDEO_GET_LABEL_DETECTION_S3, {
          dataDetectedLabels: data.Labels,
          moment: moment,
          momentDurationFormat: momentDurationFormat
        });
      }
    }
  })
})

export default router