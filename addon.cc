#include <napi.h>


class SumAsyncWorker : public Napi::AsyncWorker
{
  public:
    SumAsyncWorker(
      const Napi::Function& callback,
      const double arg0,
      const double arg1
    ) : Napi::AsyncWorker(callback), arg0(arg0), arg1(arg1), sum(0)
    {
    }

  protected:
    void Execute() override
    {
      sum = arg0 + arg1;
    }

    void OnOK() override
    {
      Napi::Env env = Env();

      Callback().MakeCallback(
        Receiver().Value(),
        {
          env.Null(),
          Napi::Number::New(env, sum)
        }
      );
    }

  private:
    double arg0;
    double arg1;
    double sum;
};


void AddCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 3) {
    Napi::TypeError::New(env, "Invalid argument count").ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsFunction()) {
    Napi::TypeError::New(env, "Invalid argument types").ThrowAsJavaScriptException();
    return;
  }

  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  double arg1 = info[1].As<Napi::Number>().DoubleValue();
  Napi::Function cb = info[2].As<Napi::Function>();

  (new SumAsyncWorker(cb, arg0, arg1))->Queue();
  return;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "add"),
    Napi::Function::New(env, AddCallback)
  );
  return exports;
}


NODE_API_MODULE(addon, Init)
