# Guia de Instalação

Este guia fornece instruções detalhadas para configurar e executar o projeto AWS Rekognition Node.js.

## Pré-requisitos Detalhados

### 1. Node.js
- Versão recomendada: 14.x ou superior
- Download: [https://nodejs.org/](https://nodejs.org/)
- Verificação da instalação:
  ```bash
  node --version
  npm --version
  ```

### 2. Yarn (Opcional, mas recomendado)
```bash
npm install -g yarn
yarn --version
```

### 3. AWS CLI
1. Instale o AWS CLI:
   - [Guia de instalação AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
   
2. Verifique a instalação:
   ```bash
   aws --version
   ```

### 4. Conta AWS
1. Crie uma conta AWS se ainda não tiver
2. Crie um usuário IAM com as seguintes permissões:
   - AmazonRekognitionFullAccess
   - AmazonS3FullAccess
   - CloudWatchLogsFullAccess

## Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/marcosvrc/aws-rekognition-node.git
cd aws-rekognition-node
```

### 2. Instale as Dependências
```bash
yarn install
# ou
npm install
```

### 3. Configure o Ambiente

1. Crie o arquivo de ambiente:
```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo .env:
```env
# AWS Configuration
AWS_REGION=sua-regiao
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key

# Application
PORT=3000
NODE_ENV=development

# S3 Configuration
S3_BUCKET=seu-bucket-name

# Rekognition Configuration
COLLECTION_ID=seu-collection-id
```

3. Configure o AWS CLI:
```bash
aws configure
```
Insira suas credenciais AWS quando solicitado.

### 4. Configuração do S3

1. Crie um bucket S3:
```bash
aws s3 mb s3://seu-bucket-name --region sua-regiao
```

2. Configure as permissões do bucket:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowRekognitionRead",
            "Effect": "Allow",
            "Principal": {
                "Service": "rekognition.amazonaws.com"
            },
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::seu-bucket-name",
                "arn:aws:s3:::seu-bucket-name/*"
            ]
        }
    ]
}
```

### 5. Configuração do Rekognition

1. Crie uma coleção do Rekognition:
```bash
aws rekognition create-collection --collection-id seu-collection-id --region sua-regiao
```

## Executando o Projeto

### Ambiente de Desenvolvimento
```bash
yarn dev
# ou
npm run dev
```

### Ambiente de Produção
1. Build do projeto:
```bash
yarn build
# ou
npm run build
```

2. Iniciar o servidor:
```bash
yarn start
# ou
npm start
```

## Verificação da Instalação

1. Acesse a aplicação:
   - URL: http://localhost:3000

2. Teste o upload de imagem:
   - Faça upload de uma imagem de teste
   - Verifique se a análise é realizada
   - Confirme se os resultados são exibidos

3. Verifique os logs:
   - Monitore os logs da aplicação
   - Verifique os logs no CloudWatch

## Troubleshooting

### Problemas Comuns

1. Erro de Credenciais AWS
```bash
aws sts get-caller-identity
```
Se falhar, verifique suas credenciais em ~/.aws/credentials

2. Erro de Permissão S3
- Verifique a política do bucket
- Confirme se o usuário IAM tem as permissões necessárias

3. Erro de Conexão
- Verifique sua conexão com a internet
- Confirme se as portas necessárias estão abertas

4. Erro de Dependências
```bash
yarn install --force
# ou
npm install --force
```

## Suporte

Para suporte adicional:
1. Consulte a [documentação oficial](link-para-documentacao)
2. Abra uma issue no GitHub
3. Entre em contato com o mantenedor do projeto

## Próximos Passos

Após a instalação:
1. Configure monitoramento
2. Implemente logging
3. Configure backup
4. Realize testes de carga
5. Documente procedimentos operacionais