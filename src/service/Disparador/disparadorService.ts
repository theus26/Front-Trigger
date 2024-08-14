import type { GetInstances, GetQrcodeInstance } from "@/interfaces/disparador";
import api from "./api";

const getFetchInstances = async (accountId: string): Promise<GetInstances> => {
  return api.get("/fetch_instances_account?account=account_" + accountId);
};

const getQrcodeInstance = async (
  instanceName: string
): Promise<GetQrcodeInstance> => {
  return api.get("/gerar_qrcode?instance_name=" + instanceName);
};

const deleteDeletarInstancia = async (instanceName: string): Promise<void> => {
  return api.delete("/deletar_instancia?instance_name=" + instanceName);
};

const deleteDesconectarInstancia = async (
  instanceName: string
): Promise<void> => {
  return api.delete("/desconectar_instancia?instance_name=" + instanceName);
};

const postCriarInstance = async (instanceName: string): Promise<void> => {
  return api.post("/criar_instancia?instance_name=" + instanceName);
};

const postDispararMensagens = async (
  instanceName: string,
  numbers: Array<string>,
  message_text: string
): Promise<void> => {
  return api.post("/disparar_mensagens", {
    instance_name: instanceName,
    numbers: numbers,
    message_text: message_text,
  });
};

export {
  getFetchInstances,
  getQrcodeInstance,
  deleteDeletarInstancia,
  deleteDesconectarInstancia,
  postCriarInstance,
  postDispararMensagens,
};
