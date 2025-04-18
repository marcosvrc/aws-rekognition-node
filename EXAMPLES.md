# Exemplos de Uso

Este documento fornece exemplos práticos de como utilizar as diferentes funcionalidades do AWS Rekognition Node.js.

## 1. Análise Facial

### Upload de Imagem para Análise Facial
1. Acesse a página inicial
2. Selecione "Análise Facial"
3. Faça upload de uma imagem com rostos
4. A aplicação retornará:
   - Número de faces detectadas
   - Idade aproximada
   - Emoções detectadas
   - Características faciais
   - Pose da cabeça
   - Qualidade da imagem

Exemplo de resposta:
```json
{
  "FaceDetails": [
    {
      "AgeRange": {
        "Low": 20,
        "High": 30
      },
      "Emotions": [
        {
          "Type": "HAPPY",
          "Confidence": 99.9
        }
      ],
      "Gender": {
        "Value": "Female",
        "Confidence": 99.9
      }
    }
  ]
}
```

## 2. Detecção de Objetos

### Análise de Objetos em Imagem
1. Selecione "Detecção de Objetos"
2. Upload da imagem
3. Resultados incluem:
   - Lista de objetos detectados
   - Confiança da detecção
   - Localização dos objetos
   - Rótulos associados

Exemplo:
```json
{
  "Labels": [
    {
      "Name": "Car",
      "Confidence": 99.2,
      "Instances": [
        {
          "BoundingBox": {
            "Width": 0.7,
            "Height": 0.4,
            "Left": 0.1,
            "Top": 0.3
          }
        }
      ]
    }
  ]
}
```

## 3. Reconhecimento de Texto

### Extração de Texto de Imagens
1. Escolha "Reconhecimento de Texto"
2. Upload da imagem
3. O sistema retorna:
   - Texto detectado
   - Localização do texto
   - Confiança da detecção

Exemplo:
```json
{
  "TextDetections": [
    {
      "DetectedText": "STOP",
      "Type": "WORD",
      "Confidence": 99.8,
      "Geometry": {
        "BoundingBox": {
          "Width": 0.3,
          "Height": 0.1,
          "Left": 0.4,
          "Top": 0.5
        }
      }
    }
  ]
}
```

## 4. Análise de Vídeo

### Processamento de Vídeo
1. Acesse "Análise de Vídeo"
2. Upload do vídeo
3. Acompanhe o progresso
4. Resultados incluem:
   - Detecção de pessoas
   - Objetos identificados
   - Atividades detectadas
   - Timeline de eventos

Exemplo de resultado:
```json
{
  "JobStatus": "SUCCEEDED",
  "VideoMetadata": {
    "Codec": "h264",
    "DurationMillis": 6000,
    "Format": "QuickTime / MOV",
    "FrameRate": 29.97,
    "FrameHeight": 1080,
    "FrameWidth": 1920
  },
  "Persons": [
    {
      "Timestamp": 0,
      "Person": {
        "Index": 0,
        "BoundingBox": {
          "Width": 0.3,
          "Height": 0.9,
          "Left": 0.4,
          "Top": 0.1
        }
      }
    }
  ]
}
```

## 5. Comparação Facial

### Comparando Duas Faces
1. Selecione "Comparação Facial"
2. Upload da imagem fonte
3. Upload da imagem alvo
4. Resultados mostram:
   - Similaridade entre faces
   - Pontos de correspondência
   - Confiança da comparação

Exemplo:
```json
{
  "FaceMatches": [
    {
      "Similarity": 98.5,
      "Face": {
        "BoundingBox": {
          "Width": 0.4,
          "Height": 0.4,
          "Left": 0.3,
          "Top": 0.2
        },
        "Confidence": 99.9
      }
    }
  ]
}
```

## 6. Moderação de Conteúdo

### Detecção de Conteúdo Impróprio
1. Acesse "Moderação de Conteúdo"
2. Upload da mídia
3. Sistema analisa:
   - Conteúdo explícito
   - Violência
   - Conteúdo ofensivo
   - Classificação etária

Exemplo:
```json
{
  "ModerationLabels": [
    {
      "Name": "Violence",
      "Confidence": 85.4,
      "ParentName": "Violence"
    }
  ]
}
```

## 7. API Endpoints

### Endpoints REST Disponíveis

#### Análise de Imagem
```bash
# Upload e análise de imagem
curl -X POST http://localhost:3000/api/analyze \
  -F "image=@/path/to/image.jpg"

# Comparação facial
curl -X POST http://localhost:3000/api/compare \
  -F "source=@/path/to/source.jpg" \
  -F "target=@/path/to/target.jpg"

# Detecção de texto
curl -X POST http://localhost:3000/api/text \
  -F "image=@/path/to/image.jpg"
```

## 8. Integração com Outras Ferramentas

### Exemplo de Integração com S3
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// Upload para S3
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file.data
  };
  return await s3.upload(params).promise();
};

// Análise com Rekognition
const analyzeImage = async (bucket, key) => {
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };
  return await rekognition.detectLabels(params).promise();
};
```

## 9. Boas Práticas

### Otimização de Imagens
- Formato recomendado: JPEG
- Resolução mínima: 64x64 pixels
- Resolução máxima: 4096x4096 pixels
- Tamanho máximo: 5MB

### Tratamento de Erros
```javascript
try {
  const result = await rekognition.detectFaces(params).promise();
} catch (error) {
  if (error.code === 'InvalidImageFormatException') {
    console.error('Formato de imagem inválido');
  } else if (error.code === 'ImageTooLargeException') {
    console.error('Imagem muito grande');
  }
}
```

## 10. Dicas e Truques

### Melhorando a Precisão
1. Qualidade da Imagem
   - Boa iluminação
   - Foco adequado
   - Contraste apropriado

2. Posicionamento
   - Faces frontais
   - Objetos bem enquadrados
   - Texto legível

3. Configurações
   - Ajuste de confiança mínima
   - Filtros apropriados
   - Parâmetros otimizados

### Performance
- Use compressão de imagem
- Implemente cache
- Processe em batch quando possível
- Monitore custos e uso