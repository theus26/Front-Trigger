import type {
  CreateInstance,
  GetInstances,
  GetQrcodeInstance,
  PostDataMessagesDisparar,
} from "@/interfaces/disparador";
import api from "./api";

const getFetchInstances = async (accountId: string): Promise<GetInstances> => {
  return api.get("/MessageTrigger/FetchInstance", { params: { accountId } });
};

const getQrcodeInstance = async (
  instanceName: string
): Promise<GetQrcodeInstance> => {
  return api.get("/MessageTrigger/ConnectInstance", {
    params: { instanceName },
  });
};

const deleteDeletarInstancia = async (instanceName: string): Promise<void> => {
  return api.delete("/MessageTrigger/DeleteInstance", {
    params: { instanceName },
  });
};

const deleteDesconectarInstancia = async (
  instanceName: string
): Promise<void> => {
  return api.delete("/MessageTrigger/LogoutInstance", {
    params: { instanceName },
  });
};

const postCriarInstance = async (
  instanceName: CreateInstance
): Promise<void> => {
  return api.post("/MessageTrigger/CreateInstance", instanceName);
};

const postDispararMensagens = async (
  instanceName: string,
  numbers: Array<string>,
  messages: PostDataMessagesDisparar[]
): Promise<void> => {
  return api.post("/MessageTrigger/SendMessageTrigger", {
    InstanceName: instanceName,
    numbers: numbers,
    messages,
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
