'use strict';

const axios = use('axios');

class CepController {
  async show({ request, response, params }) {
    const patt = new RegExp(/[0-9]{8}/g);
    const options = {
      url: `https://viacep.com.br/ws/${params.cep}/json/`,
      method: 'get',
      headers: {
        'User-Agent': 'Request-Promise'
      }
    };

    if (!patt.test(params.cep)) {
      return await response.notAcceptable({
        message: 'Cep inválido',
        erro: 'falha no teste de cep'
      });
    }

    try {
      let { data } = await axios(options);

      if (data.erro) {
        throw data;
      }

      return await response.send({
        cep: data.cep,
        logradouro: data.logradouro,
        localidade: data.localidade,
        uf: data.uf
      });
    } catch (err) {
      const errorObj = { message: '', erro: '' };

      if (err.erro) {
        errorObj.message = 'Erro ao consultar o cep';
        errorObj.erro = err.erro;
      } else {
        errorObj.message = 'Erro na requisição';
        errorObj.erro = err.response.data;
      }

      return await response.notAcceptable(errorObj);
    }
  }
}

module.exports = CepController;
